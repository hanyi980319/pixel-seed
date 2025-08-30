import { create } from 'zustand'

export type GameTheme = 'epic-fantasy' | 'cyberpunk' | 'custom'
export type GameState = 'menu' | 'loading' | 'playing'
export type CharacterType = 'player' | 'enemy' | 'npc'
export type LevelType = 'ground' | 'underground' | 'sky'

interface GameData {
  character: {
    url: string
    actions: {
      idle: string
      walk: string
      jump: string
      attack: string
    }
  } | null
  background: {
    url: string
    layers: {
      background: string
      midground: string
      foreground: string
    }
  } | null
}

interface GameStore {
  // 游戏状态
  gameState: GameState
  setGameState: (state: GameState) => void
  
  // 主题相关
  selectedTheme: GameTheme
  customPrompt: string
  setSelectedTheme: (theme: GameTheme) => void
  setCustomPrompt: (prompt: string) => void
  
  // 生成参数
  characterType: CharacterType
  levelType: LevelType
  setCharacterType: (type: CharacterType) => void
  setLevelType: (type: LevelType) => void
  
  // 当前动作
  currentAction: string
  setCurrentAction: (action: string) => void
  
  // 游戏数据
  gameData: GameData
  setGameData: (data: GameData) => void
  
  // 加载状态
  isLoading: boolean
  loadingProgress: number
  loadingMessage: string
  setLoading: (loading: boolean) => void
  setLoadingProgress: (progress: number) => void
  setLoadingMessage: (message: string) => void
  
  // 玩家位置
  playerPosition: { x: number; y: number }
  setPlayerPosition: (position: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void
  
  // 重置函数
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  // 初始状态
  gameState: 'menu',
  selectedTheme: 'epic-fantasy',
  customPrompt: '',
  characterType: 'player',
  levelType: 'ground',
  currentAction: 'idle',
  gameData: { character: null, background: null },
  isLoading: false,
  loadingProgress: 0,
  loadingMessage: '',
  playerPosition: { x: 100, y: 400 },
  
  // 状态更新函数
  setGameState: (state) => set({ gameState: state }),
  setSelectedTheme: (theme) => set({ selectedTheme: theme }),
  setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
  setCharacterType: (type) => set({ characterType: type }),
  setLevelType: (type) => set({ levelType: type }),
  setCurrentAction: (action) => set({ currentAction: action }),
  setGameData: (data) => set({ gameData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setLoadingMessage: (message) => set({ loadingMessage: message }),
  setPlayerPosition: (position) => set((state) => ({ 
    playerPosition: typeof position === 'function' ? position(state.playerPosition) : position 
  })),
  
  // 重置游戏
  resetGame: () => set({
    gameState: 'menu',
    selectedTheme: 'epic-fantasy',
    customPrompt: '',
    characterType: 'player',
    levelType: 'ground',
    currentAction: 'idle',
    gameData: { character: null, background: null },
    isLoading: false,
    loadingProgress: 0,
    loadingMessage: '',
    playerPosition: { x: 100, y: 400 },
  }),
}))