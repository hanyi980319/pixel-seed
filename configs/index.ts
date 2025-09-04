import { GameTheme } from '@/lib/store'
import { Theme } from '@/types'

/**
 * @name 游戏模板配置
 * @description 用于约束生成图像符合2D横版像素风游戏的提示词模板（包含正向提示词和反向提示词）
 */
export const GAME_TEMPLATES = {
  // 正向提示词模板
  positive: {
    character: '2D side-scrolling pixel art character, 16-bit retro style, high contrast colors, hand-drawn texture, dynamic lighting effects, razor-sharp pixel outline, ultra-bold character silhouette, crystal-clear edge definition, complete full body sprite from head to feet, roguelike design, facing right direction, perfect right-facing side view profile pose, centered composition with proper proportions, standing upright posture, full character visible within frame, absolutely pure transparent background, completely isolated character sprite with perfect transparency, zero background interference, no environmental contamination, no decorative elements, no props or objects, pristine sprite extraction, no cropping or cut-off limbs, optimal game asset format, maximum contrast separation, ultra-clean character boundaries, no adjacent objects, no surrounding elements, pure character focus, isolated subject only, minimal composition, character-only output, no contextual elements, sterile transparent isolation, perfect alpha channel transparency, clean cutout character sprite',
    background: '2D side-scrolling pixel art background, horizontal scrolling composition, high saturation dark tones, hand-drawn texture, dynamic lighting, atmospheric depth, layered parallax elements, no characters',
    ground: '2D side-scrolling pixel art ground texture, flat rectangular tile design, simple soil or dirt pattern. CRITICAL: texture must extend completely to all four edges of the image with zero margin, filling 100% of the square area from edge to edge with complete surface coverage and no empty spaces. Texture pattern must reach every pixel boundary with uniform distribution across full tile dimensions. No borders, no gaps at edges, edge-to-edge coverage mandatory. Seamless tileable pattern, minimal texture details, basic earth tones, clean pixel art style, 16-bit retro aesthetic, solid platform surface texture, game-ready tileable asset, absolutely pure white background #FFFFFF, isolated ground tile sprite, no environmental objects, no decorative elements, clean texture extraction, optimal tiling format',
    obstacle: '2D side-scrolling pixel art obstacle object, 16-bit retro style, high contrast colors, hand-drawn texture, solid blocking object, game collision asset, distinct shape definition, complete obstacle sprite, centered composition, thematically consistent design elements that match the current theme style and aesthetic, contextually appropriate materials and colors that harmonize with the theme environment, obstacle design that feels naturally integrated within the theme world, absolutely pure white background #FFFFFF, completely isolated obstacle sprite, zero background elements, no environmental interference, clean sprite extraction, optimal game asset format'
  },

  // 反向提示词模板
  negative: {
    character: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, cartoon style, anime style, oversaturated colors, environmental objects, scenery, landscape, background elements, terrain, ground, floor, walls, buildings, architecture, decorative objects, props, furniture, plants, trees, rocks, stones, weapons on ground, items scattered, atmospheric effects, particles, dust, smoke, fog, weather effects, sky, clouds, sun, moon, stars, lighting fixtures, torches, lamps, shadows on background, reflections, water, fire effects, magical auras around environment, ornamental borders, frames, UI elements, health bars, menus, text overlays, multiple characters, character duplicates, front view, back view, three-quarter view, diagonal pose, close-up shots, partial body view, cropped limbs, cut-off head or feet, zoomed-in details, portrait mode, bust shot, headshot, torso only, legs only, arms only, incomplete body parts, off-center positioning, tilted composition, extreme angles, facing left direction, left-facing pose, looking left, turned left, background textures, surface patterns, environmental details, contextual elements, setting indicators, location markers, ambient objects, secondary elements, supporting props, background artifacts, environmental noise, visual clutter, non-character pixels, background interference, mixed elements, composite backgrounds, layered environments, depth elements, atmospheric layers, background gradients, environmental shadows, contextual lighting, scene elements, world objects, left side objects, right side objects, side elements, adjacent items, surrounding objects, flanking elements, peripheral objects, side decorations, lateral elements, horizontal companions, side-by-side objects, neighboring items, bordering elements, edge objects, margin elements, side interference, lateral noise, horizontal clutter, side distractions, peripheral interference, solid background colors, white background, colored backgrounds, background fills, opaque backgrounds, background contamination, background bleeding, edge artifacts, background noise, non-transparent areas, solid color fills, background gradients, background patterns',
    background: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, characters, people, creatures, living beings, humanoid figures, animals, character silhouettes, organic life forms, human shadows, figure outlines, body shapes, limb suggestions, facial features, anthropomorphic elements, character equipment, weapons, armor pieces, clothing items, accessories',
    ground: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, characters, people, creatures, living beings, humanoid figures, animals, character silhouettes, organic life forms, human shadows, figure outlines, body shapes, limb suggestions, facial features, anthropomorphic elements, character equipment, weapons, armor pieces, clothing items, accessories, background elements, scenery, landscape, sky, clouds, atmospheric effects, particles, dust, smoke, fog, weather effects, decorative objects, props, furniture, plants, trees, rocks scattered randomly, non-tileable patterns, irregular shapes, complex compositions, layered environments, depth elements, environmental shadows, contextual lighting, scene elements, world objects, surface view, top-down view, aerial perspective, bird\'s eye view, overhead angle, surface-level texture, flat ground texture, simple surface pattern, basic ground covering, shallow texture depth, minimal layering, single-layer texture, flat terrain view, surface-only design, non-cross-sectional view, top surface texture, ground surface pattern, shallow ground texture',
    obstacle: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, characters, people, creatures, living beings, humanoid figures, animals, character silhouettes, organic life forms, human shadows, figure outlines, body shapes, limb suggestions, facial features, anthropomorphic elements, character equipment worn by characters, background elements, scenery, landscape, terrain, ground, floor, walls, buildings, architecture, atmospheric effects, particles, dust, smoke, fog, weather effects, sky, clouds, sun, moon, stars, lighting fixtures, torches, lamps, shadows on background, reflections, water, fire effects, magical auras around environment, multiple objects, object duplicates, complex compositions, layered environments, depth elements, environmental shadows, contextual lighting, scene elements, theme-inconsistent elements, mismatched style elements, conflicting design themes, inappropriate thematic elements, out-of-place objects, style-breaking elements, thematic contradictions, design inconsistencies, visual style conflicts, inappropriate color schemes, mismatched aesthetic elements'
  }
} as const

/**
 * @name 预设游戏主题
 * @description 用于提供用户选择的默认游戏主题（包含简要描述作为提示词）
 */
export const PRESET_THEMES: Theme[] = [
  {
    id: 'fantasy' as GameTheme,
    name: 'Fantasy',
    description: 'A fantasy world of magic, dragons, castles, and forests',
    characterImage: 'https://img.alicdn.com/imgextra/i4/O1CN01HumuXB245JoZGHgjd_!!6000000007339-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i4/O1CN01DX2Y9722KlwmMkO6R_!!6000000007102-2-tps-1664-928.png',
    groundImage: 'https://img.alicdn.com/imgextra/i3/O1CN019iAwgc1CQrBmzyHGh_!!6000000000076-2-tps-1328-1328.png',
    obstacleImage: 'https://img.alicdn.com/imgextra/i1/O1CN01BwiRlL1QHboRvyJpP_!!6000000001951-2-tps-1328-1328.png',
  },
  {
    id: 'cyberpunk' as GameTheme,
    name: 'Cyberpunk',
    description: 'A sci-fi world of neon lights, machinery, and future cities',
    characterImage: 'https://img.alicdn.com/imgextra/i4/O1CN01nHC1qf203FYtqGjDS_!!6000000006793-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i1/O1CN01ZV3lei1UBtKaCzJNU_!!6000000002480-2-tps-1664-928.png',
    groundImage: 'https://img.alicdn.com/imgextra/i4/O1CN01Seq5zu1f96h9sDCGk_!!6000000003963-2-tps-1328-1328.png',
    obstacleImage: 'https://img.alicdn.com/imgextra/i4/O1CN01Seq5zu1f96h9sDCGk_!!6000000003963-2-tps-1328-1328.png',
  },
  {
    id: 'western-world' as GameTheme,
    name: 'Western World',
    description: 'A wild west world of cowboys, saloons, desert landscapes, and frontier towns',
    characterImage: 'https://img.alicdn.com/imgextra/i1/O1CN01pIaSnZ1c1pYZiwXvV_!!6000000003541-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i1/O1CN01pLhR7Q1XiMFoAjrej_!!6000000002957-2-tps-1664-928.png',
    groundImage: 'https://img.alicdn.com/imgextra/i4/O1CN01Seq5zu1f96h9sDCGk_!!6000000003963-2-tps-1328-1328.png',
    obstacleImage: 'https://img.alicdn.com/imgextra/i4/O1CN01Seq5zu1f96h9sDCGk_!!6000000003963-2-tps-1328-1328.png',
  },
  {
    id: 'underwater-world' as GameTheme,
    name: 'Underwater World',
    description: 'A mysterious underwater world of coral reefs, deep sea creatures, and ancient underwater civilizations',
    characterImage: 'https://img.alicdn.com/imgextra/i3/O1CN01k0uZLf1SMlVBXbKDG_!!6000000002233-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i2/O1CN01tN5Gsu216HnoGtIKd_!!6000000006935-2-tps-1664-928.png',
    groundImage: 'https://img.alicdn.com/imgextra/i4/O1CN01Seq5zu1f96h9sDCGk_!!6000000003963-2-tps-1328-1328.png',
    obstacleImage: 'https://img.alicdn.com/imgextra/i4/O1CN01Seq5zu1f96h9sDCGk_!!6000000003963-2-tps-1328-1328.png',
  }
] as const