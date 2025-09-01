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

// 《死亡细胞》风格提示词模板
const THEME_TEMPLATES = {
  'epic-fantasy': {
    character: '2D side-scrolling pixel art character, 16-bit retro style, dark fantasy aesthetic, medieval armor with weathered textures, magical elements with glowing effects, high contrast colors, hand-drawn texture, dynamic lighting, clear pixel outline, full body sprite, roguelike warrior design, side view profile pose, pure white background #FFFFFF, isolated character only, no environment elements, perfect for sprite extraction',
     background: '2D side-scrolling pixel art background, horizontal scrolling composition, dark fantasy medieval world, ancient castles with gothic architecture, mysterious forests with atmospheric lighting, high saturation dark tones, hand-drawn texture, dynamic shadows, no characters'
   },
   'cyberpunk': {
     character: '2D side-scrolling pixel art character, 16-bit retro style, dark cyberpunk aesthetic, neon-accented futuristic clothing, high-tech weaponry, high contrast neon colors, hand-drawn texture, dynamic lighting effects, clear pixel outline, full body sprite, roguelike cyber-warrior design, side view profile pose, pure white background #FFFFFF, isolated character only, no environment elements, perfect for sprite extraction',
     background: '2D side-scrolling pixel art background, horizontal scrolling composition, dark cyberpunk cityscape, towering skyscrapers with neon signs, industrial platforms and walkways, high saturation dark tones with neon highlights, hand-drawn texture, atmospheric lighting, no characters'
   },
   'western-world': {
     character: '2D side-scrolling pixel art character, 16-bit retro style, dark western aesthetic, weathered cowboy attire, vintage firearms, high contrast earth tones, hand-drawn texture, dramatic lighting, clear pixel outline, full body sprite, roguelike gunslinger design, side view profile pose, pure white background #FFFFFF, isolated character only, no environment elements, perfect for sprite extraction',
     background: '2D side-scrolling pixel art background, horizontal scrolling composition, dark western frontier, desert landscapes with rocky formations, abandoned towns and saloons, high saturation warm tones, hand-drawn texture, sunset lighting effects, no characters'
   },
   'underwater-world': {
     character: '2D side-scrolling pixel art character, 16-bit retro style, dark aquatic aesthetic, diving gear or aquatic adaptations, underwater weaponry, high contrast blue-green tones, hand-drawn texture, underwater lighting effects, clear pixel outline, full body sprite, roguelike deep-sea explorer design, side view profile pose, pure white background #FFFFFF, isolated character only, no environment elements, perfect for sprite extraction',
     background: '2D side-scrolling pixel art background, horizontal scrolling composition, dark underwater environment, coral reefs and ancient ruins, mysterious deep-sea caverns, high saturation blue-green tones, hand-drawn texture, volumetric underwater lighting, no characters'
   },
   'custom': {
     character: '2D side-scrolling pixel art character, 16-bit retro style, dark fantasy aesthetic, high contrast colors, hand-drawn texture, dynamic lighting, clear pixel outline, full body sprite, roguelike design, side view profile pose, pure white background #FFFFFF, isolated character only, no environment elements, perfect for sprite extraction',
     background: '2D side-scrolling pixel art background, horizontal scrolling composition, dark atmospheric environment, high saturation dark tones, hand-drawn texture, dynamic lighting, no characters'
   }
}

// 构建《死亡细胞》风格提示词
function buildPrompt(type: 'character' | 'background', theme: string, customPrompt: string, characterType: string, levelType: string): string {
  const template = THEME_TEMPLATES[theme as keyof typeof THEME_TEMPLATES] || THEME_TEMPLATES.custom
  
  // 角色类型特化约束
  const characterTypeConstraints = {
    'player': 'protagonist warrior, agile combat design, distinctive heroic silhouette, combat-ready stance',
    'enemy': 'hostile creature, menacing threatening appearance, aggressive combat pose, intimidating design',
    'npc': 'non-combat character, neutral peaceful design, story-relevant appearance, civilian clothing'
  }
  
  // 场景类型特化约束
  const levelTypeConstraints = {
    'ground': 'ground level platformer environment, horizontal navigation paths, solid terrain foundations',
    'underground': 'underground dungeon caverns, stone brick textures, mysterious torch lighting, subterranean atmosphere',
    'sky': 'elevated aerial platforms, floating structures, atmospheric perspective, cloud formations'
  }
  
  if (type === 'character') {
    const typeConstraint = characterTypeConstraints[characterType as keyof typeof characterTypeConstraints] || characterType
    return theme === 'custom' 
      ? `${template.character}, ${typeConstraint}, ${customPrompt}`
      : `${template.character}, ${typeConstraint}, ${customPrompt}`
  } else {
    const levelConstraint = levelTypeConstraints[levelType as keyof typeof levelTypeConstraints] || levelType
    return theme === 'custom'
      ? `${template.background}, ${levelConstraint}, ${customPrompt}`
      : `${template.background}, ${levelConstraint}, ${customPrompt}`
  }
}

// 《死亡细胞》风格反向提示词
const NEGATIVE_PROMPTS = {
  character: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, cartoon style, anime style, oversaturated colors, environmental objects, scenery, landscape, background elements, terrain, ground, floor, walls, buildings, architecture, decorative objects, props, furniture, plants, trees, rocks, stones, weapons on ground, items scattered, atmospheric effects, particles, dust, smoke, fog, weather effects, sky, clouds, sun, moon, stars, lighting fixtures, torches, lamps, shadows on background, reflections, water, fire effects, magical auras around environment, ornamental borders, frames, UI elements, health bars, menus, text overlays, multiple characters, character duplicates, front view, back view, three-quarter view, diagonal pose',
  background: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, characters, people, creatures, living beings, humanoid figures, animals, character silhouettes, organic life forms, human shadows, figure outlines, body shapes, limb suggestions, facial features, anthropomorphic elements, character equipment, weapons, armor pieces, clothing items, accessories'
}

// 调用DashScope API
async function callDashScopeAPI(prompt: string, type: 'character' | 'background', size: string = '1328*1328'): Promise<string> {
  const negativePrompt = NEGATIVE_PROMPTS[type]
  
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
      callDashScopeAPI(characterPrompt, 'character', '1328*1328'),
      callDashScopeAPI(backgroundPrompt, 'background', '1664*928')
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