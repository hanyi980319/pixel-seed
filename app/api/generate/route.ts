import { NextRequest, NextResponse } from 'next/server'

// DashScope API配置
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'
const API_KEY = 'sk-84083f55216c4c53ad9ebf77e3f2dc7f'

// 请求参数类型
interface GenerateRequest {
  theme: 'epic-fantasy' | 'cyberpunk' | 'custom'
  prompt: string
  characterType: 'player' | 'enemy' | 'npc'
  levelType: 'ground' | 'underground' | 'sky'
}

// 提示词模板
const THEME_TEMPLATES = {
  'epic-fantasy': {
    character: 'pixel art character, fantasy style, medieval armor, magical elements, detailed sprite',
    background: 'pixel art landscape, fantasy world, castles, forests, magical atmosphere, detailed environment'
  },
  'cyberpunk': {
    character: 'pixel art character, cyberpunk style, neon colors, futuristic clothing, detailed sprite',
    background: 'pixel art cityscape, cyberpunk world, neon lights, skyscrapers, dark atmosphere, detailed environment'
  },
  'custom': {
    character: 'pixel art character, detailed sprite',
    background: 'pixel art landscape, detailed environment'
  }
}

// 构建提示词
function buildPrompt(type: 'character' | 'background', theme: string, customPrompt: string, characterType: string, levelType: string): string {
  const template = THEME_TEMPLATES[theme as keyof typeof THEME_TEMPLATES] || THEME_TEMPLATES.custom
  
  if (theme === 'custom') {
    return type === 'character' 
      ? `${template.character}, ${customPrompt}, ${characterType}`
      : `${template.background}, ${customPrompt}, ${levelType}`
  }
  
  return type === 'character'
    ? `${template.character}, ${characterType}, ${customPrompt}`
    : `${template.background}, ${levelType}, ${customPrompt}`
}

// 调用DashScope API
async function callDashScopeAPI(prompt: string, size: string = '1328*1328'): Promise<string> {
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
        negative_prompt: '',
        prompt_extend: true,
        watermark: false,
        size: size
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DashScope API error: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  
  // 检查API响应格式
  if (result.output && result.output.choices && result.output.choices[0] && 
      result.output.choices[0].message && result.output.choices[0].message.content && 
      result.output.choices[0].message.content[0] && result.output.choices[0].message.content[0].image) {
    return result.output.choices[0].message.content[0].image
  }
  
  throw new Error('Invalid API response format')
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { theme, prompt, characterType, levelType } = body

    // 验证请求参数
    if (!theme || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: theme and prompt' },
        { status: 400 }
      )
    }

    // 构建角色和背景的提示词
    const characterPrompt = buildPrompt('character', theme, prompt, characterType, levelType)
    const backgroundPrompt = buildPrompt('background', theme, prompt, characterType, levelType)

    console.log('Generating images with prompts:', {
      character: characterPrompt,
      background: backgroundPrompt
    })

    // 并行生成角色和背景图片
    const [characterUrl, backgroundUrl] = await Promise.all([
      callDashScopeAPI(characterPrompt, '1328*1328'),
      callDashScopeAPI(backgroundPrompt, '1664*928')
    ])

    // 返回生成结果
    const response = {
      success: true,
      data: {
        character: {
          url: characterUrl,
          actions: {
            idle: characterUrl,
            walk: characterUrl,
            jump: characterUrl,
            attack: characterUrl
          }
        },
        background: {
          url: backgroundUrl,
          layers: {
            background: backgroundUrl,
            midground: backgroundUrl,
            foreground: backgroundUrl
          }
        }
      },
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