import { NextRequest, NextResponse } from 'next/server'
import { GAME_TEMPLATES } from '@/configs'

// DashScope API配置
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'
const API_KEY = 'sk-84083f55216c4c53ad9ebf77e3f2dc7f'

// 请求参数类型
interface GenerateRequest {
  theme: string
  prompt: string
  types?: ('character' | 'background' | 'ground' | 'obstacle')[]
}

// 构建游戏风格提示词
function buildPrompt(type: 'character' | 'background' | 'ground' | 'obstacle', theme: string, customPrompt?: string): string {
  const baseTemplate = GAME_TEMPLATES.positive[type]
  const themePrompt = customPrompt || `${theme} style`
  return `${baseTemplate}, ${themePrompt}`
}

// 根据类型获取合适的尺寸（使用API允许的尺寸）
function getSizeForType(type: 'character' | 'background' | 'ground' | 'obstacle'): string {
  switch (type) {
    case 'character':
      return '1328*1328' // 正方形，适合角色
    case 'background':
      return '1664*928'  // 宽屏，适合背景
    case 'ground':
      return '1328*1328' // 正方形，便于无缝拼接和精确控制缺口
    case 'obstacle':
      return '1328*1328' // 正方形，适合障碍物
    default:
      return '1328*1328'
  }
}

// 调用图像抠图处理API
async function processImageCutout(imageUrl: string, type: 'character' | 'background' | 'ground' | 'obstacle'): Promise<string> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/process-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        type
      })
    })

    const result = await response.json()
    
    if (result.success) {
      return result.data.processedUrl
    } else {
      console.warn(`Image processing failed for ${type}, using original image:`, result.error)
      return imageUrl // 如果处理失败，返回原图
    }
  } catch (error) {
    console.warn(`Error processing ${type} image, using original:`, error)
    return imageUrl // 如果出错，返回原图
  }
}

// 调用DashScope API
async function callDashScopeAPI(
  prompt: string, 
  type: 'character' | 'background' | 'ground' | 'obstacle', 
  size: string = '1328*1328',
  retryCount = 0
): Promise<string> {
  const maxRetries = 3
  const baseDelay = 2000 // 2秒基础延迟
  
  try {
    const negativePrompt = GAME_TEMPLATES.negative[type]

    const response = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen-image',
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        parameters: {
          negative_prompt: negativePrompt,
          prompt_extend: true,
          watermark: false,
          size: size
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      const error = new Error(`DashScope API error: ${response.status} - ${errorText}`)
      
      // 检查是否是速率限制错误
       if (response.status === 429 && retryCount < maxRetries) {
         const delay = baseDelay * Math.pow(2, retryCount) // 指数退避
         console.log(`[${new Date().toISOString()}] Rate limit hit for ${type} image generation, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries + 1})`)
         await new Promise(resolve => setTimeout(resolve, delay))
         return callDashScopeAPI(prompt, type, size, retryCount + 1)
       }
       
       console.error(`[${new Date().toISOString()}] DashScope API error:`, {
         status: response.status,
         type,
         retryCount,
         errorText
       })
      
      throw error
    }

    const result = await response.json()

    // 检查API响应格式
    if (result.output && result.output.choices && result.output.choices[0] &&
      result.output.choices[0].message && result.output.choices[0].message.content &&
      result.output.choices[0].message.content[0] && result.output.choices[0].message.content[0].image) {
      return result.output.choices[0].message.content[0].image
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    // 如果不是速率限制错误或已达到最大重试次数，直接抛出错误
    if (retryCount >= maxRetries) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Max retries (${maxRetries}) exceeded. Last error: ${errorMessage}`)
    }
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { theme, prompt, types = ['character', 'background'] } = body

    // 验证请求参数
    if (!theme || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: theme and prompt' },
        { status: 400 }
      )
    }

    // 验证types参数
    const validTypes = ['character', 'background', 'ground', 'obstacle']
    const invalidTypes = types.filter(type => !validTypes.includes(type))
    if (invalidTypes.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid types: ${invalidTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // 构建各类型的提示词
     const prompts: Record<string, string> = {}

    types.forEach(type => {
      prompts[type] = buildPrompt(type, theme, prompt)
    })

    console.log('Generating images with prompts:', prompts)

    // 串行生成所有类型的图片，添加延迟以避免速率限制
    const data: Record<string, string> = {}
    
    for (let i = 0; i < types.length; i++) {
      const type = types[i]
      
      // 在生成多个图像时添加延迟（除了第一个）
      if (i > 0) {
        const delay = 1000 + Math.random() * 1000 // 1-2秒随机延迟
        console.log(`[${new Date().toISOString()}] Adding ${delay}ms delay before generating ${type} image`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
      
      const originalUrl = await callDashScopeAPI(prompts[type], type, getSizeForType(type))
      
      // 对角色图像自动进行抠图处理
      let finalUrl = originalUrl
      if (type === 'character') {
        console.log(`[${new Date().toISOString()}] Auto-processing character image for background removal`)
        finalUrl = await processImageCutout(originalUrl, type)
      }
      
      data[`${type}Url`] = finalUrl
    }

    // 返回生成结果
    const response = {
      success: true,
      data,
      generationId: `gen_${Date.now()}`,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Generation error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// 支持OPTIONS请求以处理CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}