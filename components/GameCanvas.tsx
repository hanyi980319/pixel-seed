'use client'

import { Card, Progress, Typography } from 'antd'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/store'
import { GameCanvasProps } from '@/types'
import { PRESET_THEMES } from '@/configs'

const { Text } = Typography

const GameCanvas: React.FC<GameCanvasProps> = ({
  isGenerating = false,
  loadingProgress = 0,
  loadingMessage = 'Loading...',
  onBackToMenu
}) => {
  const [isMobile, setIsMobile] = useState(false)

  // Canvas组件的状态和逻辑
  const {
    gameData,
    playerPosition,
    setPlayerPosition,
    setGameState,
    resetGame,
    selectedTheme,
    groundTiles,
    groundHeight,
    obstacles,
    setGroundTiles,
    setGroundHeight,
    addObstacle,
    isCollisionEnabled,
  } = useGameStore()

  const [isPaused, setIsPaused] = useState(false)
  const [currentAction, setCurrentAction] = useState('Idle')
  const [keys, setKeys] = useState<Set<string>>(new Set())

  // 初始化地面系统
  const initializeGround = useCallback(() => {
    const canvasWidth = 1000 // 游戏画布宽度
    const groundY = 400 // 地面y位置，基于地面指示线(底部上方125px)
    
    // 创建一个完整的地面条带，覆盖整个画布宽度
    const tiles = [{
      id: 'ground-strip',
      x: 0,
      y: groundY,
      width: canvasWidth,
      height: 100 // 地面高度
    }]

    setGroundTiles(tiles)
  }, [setGroundTiles])

  // 初始化障碍物
  const initializeObstacles = useCallback(() => {
    const canvasWidth = 1000
    const groundY = 400 // 地面y位置
    
    // 生成5个随机障碍物
    for (let i = 0; i < 5; i++) {
      const obstacle = {
        id: `obstacle-${Math.random().toString(36).substr(2, 9)}-${i}-${Date.now()}`, // 使用随机字符串+索引+时间戳确保唯一性
        x: Math.random() * (canvasWidth - 100) + 200, // 在200到900之间随机位置
        y: groundY - 48, // 放置在地面纹理上方，与角色高度一致
        width: 48, // 与角色宽度一致
        height: 48, // 与角色高度一致
        type: 'rock'
      }
      addObstacle(obstacle)
    }
  }, [addObstacle])

  // 设置玩家初始位置
  const setPlayerInitialPosition = useCallback(() => {
    const initialX = 50 // 道路起始点
    const initialY = 352 // 角色初始y位置，站立在地面纹理上方（400 - 48px角色高度）
    setPlayerPosition({ x: initialX, y: initialY })
  }, [setPlayerPosition])

  // 游戏初始化
  useEffect(() => {
    if (!isGenerating) {
      initializeGround()
      if (obstacles.length === 0) {
        initializeObstacles()
      }
      setPlayerInitialPosition()
    }
  }, [isGenerating, initializeGround, initializeObstacles, setPlayerInitialPosition])


  // 键盘控制
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // ESC键处理暂停/恢复
    if (e.key === 'Escape') {
      setIsPaused(!isPaused)
      return
    }

    if (isPaused) return
    setKeys(prev => new Set(prev).add(e.key.toLowerCase()))
  }, [isPaused])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys(prev => {
      const newKeys = new Set(prev)
      newKeys.delete(e.key.toLowerCase())
      return newKeys
    })
  }, [])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // 碰撞检测函数
  const checkCollision = useCallback((x: number, y: number, width: number = 48, height: number = 48) => {
    if (!isCollisionEnabled) return false

    // 检查与障碍物的碰撞
    for (const obstacle of obstacles) {
      if (x < obstacle.x + obstacle.width &&
        x + width > obstacle.x &&
        y < obstacle.y + obstacle.height &&
        y + height > obstacle.y) {
        return true
      }
    }
    return false
  }, [obstacles, isCollisionEnabled])

  // 角色物理状态
  const [character, setCharacter] = useState({
    x: 50,
    y: 85,
    width: 48,
    height: 48,
    velocityY: 0,
    isJumping: false,
    onGround: true
  })

  // 游戏循环
  useEffect(() => {
    if (isPaused || isGenerating) return

    const gameLoop = setInterval(() => {
      setCharacter(prev => {
        let newX = prev.x
        let newY = prev.y
        let newVelocityY = prev.velocityY
        let newIsJumping = prev.isJumping
        let newOnGround = prev.onGround
        let action = 'idle'
        const playerWidth = 48
        const playerHeight = 48
        const gravity = 0.8
        const jumpPower = -15
        const groundY = 352 // 固定地面位置，与地面纹理对齐

        // 左右移动逻辑
        if (keys.has('a') || keys.has('arrowleft')) {
          const testX = Math.max(0, newX - 5)
          if (!checkCollision(testX, newY, playerWidth, playerHeight)) {
            newX = testX
            action = 'Moving Left'
          }
        }
        if (keys.has('d') || keys.has('arrowright')) {
          const testX = Math.min(800, newX + 5)
          if (!checkCollision(testX, newY, playerWidth, playerHeight)) {
            newX = testX
            action = 'Moving Right'
          }
        }

        // 跳跃逻辑 - 只有在地面上才能跳跃
        if (keys.has(' ') && newOnGround) {
          newVelocityY = jumpPower
          newIsJumping = true
          newOnGround = false
          action = 'Jumping'
        }

        // 应用重力
        if (!newOnGround) {
          newVelocityY += gravity
          newY += newVelocityY

          // 检查是否落地
          if (newY >= groundY) {
            newY = groundY
            newVelocityY = 0
            newIsJumping = false
            newOnGround = true
          }
        }

        // 碰撞检测
        if (checkCollision(newX, newY, playerWidth, playerHeight)) {
          // 如果发生碰撞，恢复到之前的位置
          newX = prev.x
          newY = prev.y
        }

        if (action === 'idle' && newOnGround) {
          setCurrentAction('Idle')
        } else {
          setCurrentAction(action)
        }

        // 更新玩家位置
        setPlayerPosition({ x: newX, y: newY })

        return {
          x: newX,
          y: newY,
          width: playerWidth,
          height: playerHeight,
          velocityY: newVelocityY,
          isJumping: newIsJumping,
          onGround: newOnGround
        }
      })
    }, 16) // 60 FPS

    return () => clearInterval(gameLoop)
  }, [keys, isPaused, isGenerating, setPlayerPosition, checkCollision])

  const handleBackToMenu = () => {
    resetGame()
    setGameState('menu')
    if (onBackToMenu) {
      onBackToMenu()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // 获取当前主题的预览图片
  const getThemeImages = () => {
    if (selectedTheme && selectedTheme !== 'custom') {
      const theme = PRESET_THEMES.find(t => t.id === selectedTheme)
      if (theme) {
        return {
          character: theme.characterImage,
          background: theme.backgroundImage,
          ground: theme.groundImage,
          obstacle: theme.obstacleImage
        }
      }
    }
    // 如果是自定义主题或生成的内容，使用gameData
    if (gameData?.data) {
      return {
        character: gameData.data.characterUrl,
        background: gameData.data.backgroundUrl,
        ground: gameData.data.groundUrl,
        obstacle: gameData.data.obstacleUrl
      }
    }
    return {
      character: null,
      background: null,
      ground: null,
      obstacle: null
    }
  }

  const containerPadding = isMobile ? '10px' : '20px'
  const cardPadding = isMobile ? '12px' : '20px'
  const themeImages = getThemeImages()

  return (
    <Card
      title="Game Canvas"
      style={{
        flex: 1,
        height: '100%',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      bodyStyle={{
        flex: 1,
        padding: cardPadding,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa'
      }}
    >


      {/* 游戏内容区域 */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #e9ecef',
        minHeight: isMobile ? '300px' : '400px',
        position: 'relative'
      }}>
        {isGenerating ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            padding: '40px'
          }}>
            <div style={{
              fontSize: isMobile ? '48px' : '64px',
              marginBottom: '20px'
            }}>🎮</div>

            <Text style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              {loadingMessage}
            </Text>

            <Progress
              percent={loadingProgress}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              style={{ width: isMobile ? '200px' : '300px' }}
            />

            <Text style={{
              fontSize: '14px',
              color: '#999',
              marginTop: '8px'
            }}>
              {Math.round(loadingProgress)}% 完成
            </Text>
          </div>
        ) : (
          // 游戏Canvas内容
          <div className="w-full h-full relative overflow-hidden" style={{
            backgroundImage: themeImages.background ? `url(${themeImages.background})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
            <div className="relative w-full h-full">
              {/* 地面瓦片 */}
              {groundTiles.map(tile => (
                <div
                  key={tile.id}
                  className="absolute"
                  style={{
                    left: tile.x,
                    top: tile.y,
                    width: tile.width,
                    height: tile.height,
                    backgroundImage: themeImages.ground ? `url(${themeImages.ground})` : 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.1) 2px, rgba(255,255,255,.1) 4px)',
                    backgroundColor: themeImages.ground ? 'transparent' : '#8B4513',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top left',
                    backgroundRepeat: 'repeat',
                    border: '1px solid #654321'
                  }}
                />
              ))}

              {/* 障碍物 */}
              {obstacles.map(obstacle => (
                <div
                  key={obstacle.id}
                  className="absolute rounded"
                  style={{
                    left: obstacle.x,
                    top: obstacle.y,
                    width: obstacle.width,
                    height: obstacle.height,
                    backgroundImage: themeImages.obstacle ? `url(${themeImages.obstacle})` : 'none',
                    backgroundColor: themeImages.obstacle ? 'transparent' : '#654321',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    border: '2px solid #8B4513',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                />
              ))}

              {/* 角色 */}
              <motion.div
                className="absolute w-12 h-12 sm:w-16 sm:h-16 z-10"
                style={{
                  left: playerPosition.x,
                  top: playerPosition.y,
                }}
                animate={{
                  scaleX: keys.has('a') || keys.has('arrowleft') ? -1 : 1,
                }}
                transition={{ duration: 0.1 }}
              >
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat pixelated"
                  style={{
                    backgroundImage: themeImages.character ? `url(${themeImages.character})` : 'none',
                    backgroundColor: themeImages.character ? 'transparent' : '#4a5568',
                    borderRadius: themeImages.character ? '0' : '50%'
                  }}
                >
                  {!themeImages.character && (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                      🎮
                    </div>
                  )}
                </div>
              </motion.div>

              {/* 地面指示线（开发用） */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" style={{ bottom: '125px' }} />

              {/* 游戏UI */}
              {/* 左侧控制面板 */}
              <div className="absolute top-0 left-0 p-2 z-20">
                <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-white font-mono text-xs">
                  <div className="space-y-2">
                    <button
                      onClick={handleBackToMenu}
                      className="w-full px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs transition-all duration-200"
                    >
                      Back to Menu
                    </button>
                    <button
                      onClick={togglePause}
                      className="w-full px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs transition-all duration-200"
                    >
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 右侧信息面板 */}
              <div className="absolute top-0 right-0 p-2 z-20">
                <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-2 text-white font-mono text-xs">
                  <div className="space-y-1">
                    <p>Pos: ({Math.round(playerPosition.x)}, {Math.round(playerPosition.y)})</p>
                    <p>Action: {currentAction}</p>
                    <p>Status: {isPaused ? 'Paused' : 'Playing'}</p>
                  </div>
                </div>
              </div>

              {/* 底部控制提示 */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-2 sm:p-4 text-white font-mono text-xs sm:text-sm text-center"
                >
                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-6">
                    <span>A/D / Left/Right: Move</span>
                    <span>Space: Jump</span>
                    <span>ESC: Pause</span>
                  </div>
                </motion.div>
              </div>

              {/* 暂停遮罩 */}
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 cursor-pointer"
                  onClick={togglePause}
                >
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-white font-mono mb-4">Game Paused</h2>
                    <p className="text-gray-300 font-mono">Press ESC or click anywhere to continue</p>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default GameCanvas