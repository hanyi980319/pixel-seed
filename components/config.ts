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