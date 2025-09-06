import { create } from 'zustand'

export type GameTheme = 'fantasy' | 'cyberpunk' | 'custom'
export type GameState = 'menu' | 'loading' | 'playing'
export type CharacterType = 'player' | 'enemy' | 'npc'
export type LevelType = 'ground' | 'underground' | 'sky'

interface GameData {
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

interface ProcessedImages {
  character?: string
  background?: string
  ground?: string
  obstacle?: string
}

interface Obstacle {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
}

interface GroundTile {
  id: string
  x: number
  y: number
  width: number
  height: number
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
  
  // 抠图结果
  processedImages: ProcessedImages
  setProcessedImages: (images: ProcessedImages) => void
  updateProcessedImage: (type: keyof ProcessedImages, url: string) => void
  
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
  
  // 地面系统
  groundTiles: GroundTile[]
  groundHeight: number
  setGroundTiles: (tiles: GroundTile[]) => void
  setGroundHeight: (height: number) => void
  
  // 障碍物系统
  obstacles: Obstacle[]
  setObstacles: (obstacles: Obstacle[]) => void
  addObstacle: (obstacle: Obstacle) => void
  removeObstacle: (id: string) => void
  
  // 碰撞检测
  isCollisionEnabled: boolean
  setCollisionEnabled: (enabled: boolean) => void
  
  // 持久化
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void
  
  // 重置函数
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  // 初始状态
  gameState: 'menu',
  selectedTheme: 'fantasy',
  customPrompt: '',
  characterType: 'player',
  levelType: 'ground',
  currentAction: 'idle',
  gameData: {},
  processedImages: {},
  isLoading: false,
  loadingProgress: 0,
  loadingMessage: '',
  playerPosition: { x: 100, y: 400 },
  groundTiles: [],
  groundHeight: 350,
  obstacles: [],
  isCollisionEnabled: true,
  
  // 状态更新函数
  setGameState: (state) => set({ gameState: state }),
  setSelectedTheme: (theme) => set({ selectedTheme: theme }),
  setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
  setCharacterType: (type) => set({ characterType: type }),
  setLevelType: (type) => set({ levelType: type }),
  setCurrentAction: (action) => set({ currentAction: action }),
  setGameData: (data) => {
    set({ gameData: data })
    get().saveToLocalStorage()
  },
  setProcessedImages: (images) => {
    set({ processedImages: images })
    get().saveToLocalStorage()
  },
  updateProcessedImage: (type, url) => {
    set((state) => ({
      processedImages: { ...state.processedImages, [type]: url }
    }))
    get().saveToLocalStorage()
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setLoadingMessage: (message) => set({ loadingMessage: message }),
  setPlayerPosition: (position) => set((state) => ({ 
    playerPosition: typeof position === 'function' ? position(state.playerPosition) : position 
  })),
  setGroundTiles: (tiles) => set({ groundTiles: tiles }),
  setGroundHeight: (height) => set({ groundHeight: height }),
  setObstacles: (obstacles) => set({ obstacles: obstacles }),
  addObstacle: (obstacle) => set((state) => ({ obstacles: [...state.obstacles, obstacle] })),
  removeObstacle: (id) => set((state) => ({ obstacles: state.obstacles.filter(o => o.id !== id) })),
  setCollisionEnabled: (enabled) => set({ isCollisionEnabled: enabled }),
  
  // 持久化方法
  saveToLocalStorage: () => {
    const state = get()
    const dataToSave = {
      gameData: state.gameData,
      processedImages: state.processedImages,
      selectedTheme: state.selectedTheme,
      customPrompt: state.customPrompt
    }
    localStorage.setItem('pixel-seed-game-data', JSON.stringify(dataToSave))
  },
  
  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem('pixel-seed-game-data')
      if (saved) {
        const data = JSON.parse(saved)
        set({
          gameData: data.gameData || {},
          processedImages: data.processedImages || {},
          selectedTheme: data.selectedTheme || 'fantasy',
          customPrompt: data.customPrompt || ''
        })
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
  },
  
  // 重置游戏（保留抠图结果）
  resetGame: () => {
    const currentState = get()
    set({
      gameState: 'menu',
      selectedTheme: currentState.selectedTheme, // 保留当前选择的主题
      customPrompt: currentState.customPrompt, // 保留自定义提示
      characterType: 'player',
      levelType: 'ground',
      currentAction: 'idle',
      gameData: currentState.gameData, // 保留游戏数据
      processedImages: currentState.processedImages, // 保留抠图结果
      isLoading: false,
      loadingProgress: 0,
      loadingMessage: '',
      playerPosition: { x: 100, y: 400 },
      groundTiles: [],
      groundHeight: 350,
      obstacles: [],
      isCollisionEnabled: true,
    })
    get().saveToLocalStorage()
  },
}))