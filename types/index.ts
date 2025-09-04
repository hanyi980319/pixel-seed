import { ReactNode } from 'react'
import { GameTheme } from '@/lib/store'

// 主题相关类型
export interface Theme {
  id: GameTheme
  name: string
  description: string
  characterImage: string
  backgroundImage: string
  groundImage: string
  obstacleImage: string
  isLoading?: boolean
}

// 游戏数据类型
export interface GameData {
  success?: boolean
  data?: {
    characterUrl: string
    backgroundUrl: string
    groundUrl?: string
    obstacleUrl?: string
  }
  generationId?: string
  timestamp?: string

}

// 项目头部组件Props
export interface ProjectHeaderProps {
  className?: string
}

// 模型选择器组件Props
export interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
  apiKey: string
  onApiKeyChange: (apiKey: string) => void
}

// 主题定制器组件Props
export interface ThemeCustomizerProps {
  customThemeName: string
  onThemeNameChange: (name: string) => void
  customPrompt: string
  onPromptChange: (prompt: string) => void
}

// 操作按钮组件Props
export interface ActionButtonsProps {
  isThemeCreated: boolean
  isLoading: boolean
  selectedTheme: string
  customPrompt: string
  customThemeName: string
  apiKey: string
  onCreateTheme: () => void
  onStartGame: () => void
}

// 主题列表组件Props
export interface ThemesListProps {
  themes: Theme[]
  selectedTheme: GameTheme
  onThemeSelect: (themeId: GameTheme) => void
}

// 主题预览组件Props
export interface ThemePreviewProps {
  isLoading: boolean
  loadingProgress: number
  gameData?: GameData
  selectedTheme: GameTheme
  themes: Theme[]
  onRegenerateImage?: (themeId: string, imageType: 'character' | 'background' | 'ground' | 'obstacle') => void
}

// 进度指示器组件Props
export interface ProgressIndicatorProps {
  loadingMessage: string
  loadingProgress: number
}

// 游戏画布组件Props
export interface GameCanvasProps {
  loadingProgress?: number
  loadingMessage?: string
  onBackToMenu?: () => void
}

// 主菜单组件Props
export interface MenuProps {
  className?: string
}

// 主题选择处理函数类型
export type ThemeSelectHandler = (themeId: GameTheme) => void

// 主题创建处理函数类型
export type ThemeCreateHandler = () => Promise<void>

// 游戏开始处理函数类型
export type GameStartHandler = () => void