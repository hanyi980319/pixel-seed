import { GameTheme } from '@/lib/store'
import { Theme } from '@/types'

/**
 * @name 游戏模板配置
 * @description 用于约束生成图像符合2D横版像素风游戏的提示词模板（包含正向提示词和反向提示词）
 */
export const GAME_TEMPLATES = {
  // 正向提示词模板
  positive: {
    character: '2D side-scrolling pixel art character, 16-bit retro style, high contrast colors, hand-drawn texture, dynamic lighting effects, sharp crisp pixel outline, bold character silhouette, distinct edge definition, complete full body sprite from head to feet, roguelike design, facing right direction, perfect right-facing side view profile pose, centered composition with proper proportions, standing upright posture, full character visible within frame, absolutely pure white background #FFFFFF, completely isolated character sprite, zero background elements, no environmental interference, no decorative elements, no props or objects, clean sprite extraction, no cropping or cut-off limbs, optimal game asset format, maximum contrast separation from background',
    background: '2D side-scrolling pixel art background, horizontal scrolling composition, high saturation dark tones, hand-drawn texture, dynamic lighting, no characters',
    ground: '2D side-scrolling pixel art ground texture, seamless tileable pattern, horizontal repeating surface, detailed terrain texture, high contrast colors, hand-drawn pixel style, 16-bit retro aesthetic, solid platform surface, game-ready tileable asset, absolutely pure white background #FFFFFF, isolated ground tile sprite, no environmental objects, no decorative elements, clean texture extraction, optimal tiling format',
    obstacle: '2D side-scrolling pixel art obstacle object, 16-bit retro style, high contrast colors, hand-drawn texture, solid blocking object, game collision asset, distinct shape definition, complete obstacle sprite, centered composition, absolutely pure white background #FFFFFF, completely isolated obstacle sprite, zero background elements, no environmental interference, clean sprite extraction, optimal game asset format'
  },

  // 反向提示词模板
  negative: {
    character: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, cartoon style, anime style, oversaturated colors, environmental objects, scenery, landscape, background elements, terrain, ground, floor, walls, buildings, architecture, decorative objects, props, furniture, plants, trees, rocks, stones, weapons on ground, items scattered, atmospheric effects, particles, dust, smoke, fog, weather effects, sky, clouds, sun, moon, stars, lighting fixtures, torches, lamps, shadows on background, reflections, water, fire effects, magical auras around environment, ornamental borders, frames, UI elements, health bars, menus, text overlays, multiple characters, character duplicates, front view, back view, three-quarter view, diagonal pose, close-up shots, partial body view, cropped limbs, cut-off head or feet, zoomed-in details, portrait mode, bust shot, headshot, torso only, legs only, arms only, incomplete body parts, off-center positioning, tilted composition, extreme angles, facing left direction, left-facing pose, looking left, turned left, background textures, surface patterns, environmental details, contextual elements, setting indicators, location markers, ambient objects, secondary elements, supporting props, background artifacts, environmental noise, visual clutter, non-character pixels, background interference, mixed elements, composite backgrounds, layered environments, depth elements, atmospheric layers, background gradients, environmental shadows, contextual lighting, scene elements, world objects',
    background: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, characters, people, creatures, living beings, humanoid figures, animals, character silhouettes, organic life forms, human shadows, figure outlines, body shapes, limb suggestions, facial features, anthropomorphic elements, character equipment, weapons, armor pieces, clothing items, accessories',
    ground: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, characters, people, creatures, living beings, humanoid figures, animals, character silhouettes, organic life forms, human shadows, figure outlines, body shapes, limb suggestions, facial features, anthropomorphic elements, character equipment, weapons, armor pieces, clothing items, accessories, background elements, scenery, landscape, sky, clouds, atmospheric effects, particles, dust, smoke, fog, weather effects, decorative objects, props, furniture, plants, trees, rocks scattered randomly, non-tileable patterns, irregular shapes, complex compositions, layered environments, depth elements, environmental shadows, contextual lighting, scene elements, world objects',
    obstacle: '3D render, realistic style, photorealistic, low resolution, blurry, smooth gradients, modern UI elements, flat design, vector art, characters, people, creatures, living beings, humanoid figures, animals, character silhouettes, organic life forms, human shadows, figure outlines, body shapes, limb suggestions, facial features, anthropomorphic elements, character equipment worn by characters, background elements, scenery, landscape, terrain, ground, floor, walls, buildings, architecture, atmospheric effects, particles, dust, smoke, fog, weather effects, sky, clouds, sun, moon, stars, lighting fixtures, torches, lamps, shadows on background, reflections, water, fire effects, magical auras around environment, multiple objects, object duplicates, complex compositions, layered environments, depth elements, environmental shadows, contextual lighting, scene elements'
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
    characterImage: 'https://img.alicdn.com/imgextra/i3/O1CN01ayAYl31bEMmWoMsJ3_!!6000000003433-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i4/O1CN01DX2Y9722KlwmMkO6R_!!6000000007102-2-tps-1664-928.png',
    groundImage: 'https://img.alicdn.com/imgextra/i2/O1CN01tN5Gsu216HnoGtIKd_!!6000000006935-2-tps-1664-928.png',
    obstacleImage: 'https://img.alicdn.com/imgextra/i3/O1CN01ayAYl31bEMmWoMsJ3_!!6000000003433-2-tps-1328-1328.png',
  },
  {
    id: 'cyberpunk' as GameTheme,
    name: 'Cyberpunk',
    description: 'A sci-fi world of neon lights, machinery, and future cities',
    characterImage: 'https://img.alicdn.com/imgextra/i4/O1CN01nHC1qf203FYtqGjDS_!!6000000006793-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i1/O1CN01ZV3lei1UBtKaCzJNU_!!6000000002480-2-tps-1664-928.png',
    groundImage: 'https://img.alicdn.com/imgextra/i1/O1CN01ZV3lei1UBtKaCzJNU_!!6000000002480-2-tps-1664-928.png',
    obstacleImage: 'https://img.alicdn.com/imgextra/i4/O1CN01nHC1qf203FYtqGjDS_!!6000000006793-2-tps-1328-1328.png',
  },
  {
    id: 'western-world' as GameTheme,
    name: 'Western World',
    description: 'A wild west world of cowboys, saloons, desert landscapes, and frontier towns',
    characterImage: 'https://img.alicdn.com/imgextra/i1/O1CN01pIaSnZ1c1pYZiwXvV_!!6000000003541-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i1/O1CN01pLhR7Q1XiMFoAjrej_!!6000000002957-2-tps-1664-928.png',
    groundImage: 'https://img.alicdn.com/imgextra/i1/O1CN01pLhR7Q1XiMFoAjrej_!!6000000002957-2-tps-1664-928.png',
    obstacleImage: 'https://img.alicdn.com/imgextra/i1/O1CN01pIaSnZ1c1pYZiwXvV_!!6000000003541-2-tps-1328-1328.png',
  },
  {
    id: 'underwater-world' as GameTheme,
    name: 'Underwater World',
    description: 'A mysterious underwater world of coral reefs, deep sea creatures, and ancient underwater civilizations',
    characterImage: 'https://img.alicdn.com/imgextra/i3/O1CN01k0uZLf1SMlVBXbKDG_!!6000000002233-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i2/O1CN01tN5Gsu216HnoGtIKd_!!6000000006935-2-tps-1664-928.png',
    groundImage: 'https://img.alicdn.com/imgextra/i2/O1CN01tN5Gsu216HnoGtIKd_!!6000000006935-2-tps-1664-928.png',
    obstacleImage: 'https://img.alicdn.com/imgextra/i3/O1CN01k0uZLf1SMlVBXbKDG_!!6000000002233-2-tps-1328-1328.png',
  }
] as const