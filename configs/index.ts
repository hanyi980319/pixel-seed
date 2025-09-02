import { GameTheme } from '@/lib/store'

export interface PresetTheme {
  id: GameTheme
  name: string
  description: string
  icon: string
  coverImage: string
  characterImage: string
  backgroundImage: string
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'epic-fantasy' as GameTheme,
    name: 'Epic Fantasy',
    description: 'A fantasy world of magic, dragons, castles, and forests',
    icon: '🧙‍♂️',
    coverImage: 'https://img.alicdn.com/imgextra/i3/O1CN01oE45Og1lEV3Pj2zqD_!!6000000004787-2-tps-1664-928.png',
    characterImage: 'https://img.alicdn.com/imgextra/i2/O1CN01j9EfiV1OPjbhAHeK2_!!6000000001698-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i3/O1CN01oE45Og1lEV3Pj2zqD_!!6000000004787-2-tps-1664-928.png'
  },
  {
    id: 'cyberpunk' as GameTheme,
    name: 'Cyberpunk',
    description: 'A sci-fi world of neon lights, machinery, and future cities',
    icon: '🚀',
    coverImage: 'https://img.alicdn.com/imgextra/i2/O1CN01Wgbr5p1jMcqjUJhhX_!!6000000004534-2-tps-1664-928.png',
    characterImage: 'https://img.alicdn.com/imgextra/i4/O1CN01nHC1qf203FYtqGjDS_!!6000000006793-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i2/O1CN01Wgbr5p1jMcqjUJhhX_!!6000000004534-2-tps-1664-928.png'
  },
  {
    id: 'western-world' as GameTheme,
    name: 'Western World',
    description: 'A wild west world of cowboys, saloons, desert landscapes, and frontier towns',
    icon: '🤠',
    coverImage: 'https://img.alicdn.com/imgextra/i1/O1CN015KYfWA1ajDqgDLuOe_!!6000000003365-2-tps-1664-928.png',
    characterImage: 'https://img.alicdn.com/imgextra/i1/O1CN01qffUt41LbEhpnCizQ_!!6000000001317-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i1/O1CN015KYfWA1ajDqgDLuOe_!!6000000003365-2-tps-1664-928.png'
  },
  {
    id: 'underwater-world' as GameTheme,
    name: 'Underwater World',
    description: 'A mysterious underwater world of coral reefs, deep sea creatures, and ancient underwater civilizations',
    icon: '🐠',
    coverImage: 'https://img.alicdn.com/imgextra/i4/O1CN01ZLJHW326q9XwyXI4c_!!6000000007712-2-tps-1664-928.png',
    characterImage: 'https://img.alicdn.com/imgextra/i3/O1CN01k0uZLf1SMlVBXbKDG_!!6000000002233-2-tps-1328-1328.png',
    backgroundImage: 'https://img.alicdn.com/imgextra/i4/O1CN01ZLJHW326q9XwyXI4c_!!6000000007712-2-tps-1664-928.png'
  }
]

// 配置常量
// 《死亡细胞》风格基础约束
export const DEAD_CELLS_STYLE = {
  // 基础2D横版像素艺术约束
  base: {
    character: '2D side-scrolling pixel art character, 16-bit retro style, dark fantasy aesthetic, high contrast colors, hand-drawn texture, dynamic lighting effects, clear pixel outline, full body sprite, roguelike design',
    background: '2D side-scrolling pixel art background, horizontal scrolling composition, dark fantasy atmosphere, high saturation dark tones, dynamic lighting, hand-drawn texture, no characters'
  },
  // 角色类型约束
  character: {
    player: 'protagonist character, agile warrior design, distinctive silhouette, combat-ready pose, perfect side profile proportions, authentic game character anatomy, precise pixel-perfect silhouette, heroic stance with proper body ratios',
    enemy: 'hostile creature, menacing appearance, combat stance, threatening design, accurate side view anatomy, game-authentic proportions, clear hostile silhouette, intimidating profile pose',
    npc: 'non-combat character, neutral design, story-relevant appearance, proper side profile stance, consistent game world proportions, recognizable character archetype, balanced body structure'
  },
  // 场景类型约束
  background: {
    ground: 'ground level environment, platformer layout, horizontal navigation paths',
    underground: 'underground caverns, dungeon atmosphere, stone textures, mysterious lighting',
    sky: 'elevated platforms, aerial environment, floating structures, atmospheric perspective'
  }
}

export const CONFIG = {
  // 主题相关配置
  THEMES: {
    DEFAULT_THEME: 'epic-fantasy' as GameTheme,
    PRESET_THEMES: PRESET_THEMES
  },

  // 其他可扩展的配置项
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500
  }
} as const