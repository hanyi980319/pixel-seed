'use client'

import { Card, Progress, Typography } from 'antd'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/store'
import { GameCanvasProps } from '@/types'
import { PRESET_THEMES } from '@/configs'

const { Text } = Typography

const GameCanvas: React.FC<GameCanvasProps> = ({
  loadingProgress = 0,
  loadingMessage = 'Loading...',
  onBackToMenu
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const gameCanvasRef = useRef<HTMLDivElement>(null)

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
  const [isGameOver, setIsGameOver] = useState(false)
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

  // 智能障碍物生成算法
  const initializeObstacles = useCallback(() => {
    const canvasWidth = 1000
    const groundY = 400 // 地面y位置
    const obstacleWidth = 48
    const obstacleHeight = 48
    const minDistance = 80 // 最小安全距离
    const startX = 150 // 起始生成位置，给角色留出空间
    const endX = 850 // 结束生成位置，避免太靠近边界
    const maxAttempts = 50 // 最大尝试次数，防止无限循环

    const generatedObstacles = []
    const targetCount = 6 // 目标障碍物数量

    // 检查两个矩形是否重叠或距离过近
    const isValidPosition = (newX: number, newY: number, existingObstacles: Array<{ x: number, y: number }>) => {
      for (const existing of existingObstacles) {
        const distanceX = Math.abs(newX - existing.x)
        const distanceY = Math.abs(newY - existing.y)

        // 检查是否满足最小距离要求
        if (distanceX < minDistance && distanceY < minDistance) {
          return false
        }
      }
      return true
    }

    // 使用网格化方法确保均匀分布
    const gridSize = Math.floor((endX - startX) / targetCount)

    for (let i = 0; i < targetCount; i++) {
      let attempts = 0
      let validPosition = false
      let obstacleX = 0
      let obstacleY = groundY - obstacleHeight

      while (!validPosition && attempts < maxAttempts) {
        // 在当前网格区域内随机生成位置
        const gridStart = startX + (i * gridSize)
        const gridEnd = Math.min(gridStart + gridSize - obstacleWidth, endX - obstacleWidth)

        obstacleX = Math.random() * (gridEnd - gridStart) + gridStart
        obstacleY = groundY - obstacleHeight

        validPosition = isValidPosition(obstacleX, obstacleY, generatedObstacles)
        attempts++
      }

      // 如果找到有效位置，添加障碍物
      if (validPosition) {
        const obstacle = {
          id: `obstacle-${Math.random().toString(36).substr(2, 9)}-${i}-${Date.now()}`,
          x: obstacleX,
          y: obstacleY,
          width: obstacleWidth,
          height: obstacleHeight,
          type: 'rock'
        }
        generatedObstacles.push(obstacle)
        addObstacle(obstacle)
      }
    }

    console.log(`成功生成 ${generatedObstacles.length} 个障碍物，分布均匀且无重叠`)
  }, [addObstacle])

  // 设置玩家初始位置
  const setPlayerInitialPosition = useCallback(() => {
    const initialX = 50 // 道路起始点
    const initialY = 352 // 角色初始y位置，站立在地面纹理上方（400 - 48px角色高度）
    setPlayerPosition({ x: initialX, y: initialY })
  }, [setPlayerPosition])

  // 游戏初始化
  useEffect(() => {
    initializeGround()
    if (obstacles.length === 0) {
      initializeObstacles()
    }
    setPlayerInitialPosition()
  }, [initializeGround, initializeObstacles, setPlayerInitialPosition])


  // 键盘控制
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // ESC键处理暂停/恢复 - 只在非游戏结束状态下生效
    if (e.key === 'Escape' && !isGameOver) {
      setIsPaused(!isPaused)
      return
    }

    if (isPaused || isGameOver) return
    setKeys(prev => new Set(prev).add(e.key.toLowerCase()))
  }, [isPaused, isGameOver])

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
    y: 352, // 与障碍物位置一致，紧贴地面纹理上方
    width: 48,
    height: 48,
    velocityY: 0,
    isJumping: false,
    onGround: true,
    facingDirection: 1 // 1为右，-1为左
  })

  // 游戏循环 - 使用requestAnimationFrame优化性能
  useEffect(() => {
    if (isPaused) return

    let animationId: number
    let lastTime = 0
    const targetFPS = 60
    const frameTime = 1000 / targetFPS

    const gameLoop = (currentTime: number) => {
      if (currentTime - lastTime >= frameTime) {
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

          let newFacingDirection = prev.facingDirection

          // 左右移动逻辑
          if (keys.has('a') || keys.has('arrowleft')) {
            const testX = Math.max(0, newX - 5)
            if (!checkCollision(testX, newY, playerWidth, playerHeight)) {
              newX = testX
              newFacingDirection = -1 // 面向左
              action = 'Moving Left'
            }
          }
          if (keys.has('d') || keys.has('arrowright')) {
            const testX = newX + 5
            // 动态获取游戏画布的实际宽度和位置
            let gameEndBoundary = 900 // 默认值作为后备
            if (gameCanvasRef.current) {
              const rect = gameCanvasRef.current.getBoundingClientRect()
              const actualCanvasWidth = rect.width
              gameEndBoundary = actualCanvasWidth - playerWidth - 50 // 增加安全边距，确保能触发游戏结束
            }
            // 检查是否到达边界
            if (testX >= gameEndBoundary) {
              // 触发游戏结束 - 随机选择有趣的提示文案
              const gameOverMessages = [
                '🎯 Congratulations explorer! You have reached the edge of the world!',
                '🚀 Amazing! You successfully traversed the entire level!',
                '⭐ Mission complete! You are a true jumping master!',
                '🏆 Outstanding! You conquered this pixel world!',
                '🎮 Awesome! Ready for the next challenge!'
              ]
              const randomMessage = gameOverMessages[Math.floor(Math.random() * gameOverMessages.length)]
              // 确保状态同步更新
              setCurrentAction(`Game Over - ${randomMessage}`)
              setTimeout(() => setIsGameOver(true), 0) // 使用setTimeout确保currentAction先更新
            } else if (!checkCollision(testX, newY, playerWidth, playerHeight)) {
              newX = testX
              newFacingDirection = 1 // 面向右
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

          // 改进的重力和碰撞系统
          if (!newOnGround) {
            newVelocityY += gravity
            const testY = newY + newVelocityY

            // 检查是否落地（地面）
            if (testY >= groundY) {
              newY = groundY
              newVelocityY = 0
              newIsJumping = false
              newOnGround = true
            } else {
              // 检查是否落在障碍物上
              let landedOnObstacle = false
              for (const obstacle of obstacles) {
                if (newX + playerWidth > obstacle.x &&
                  newX < obstacle.x + obstacle.width &&
                  testY + playerHeight >= obstacle.y &&
                  testY + playerHeight <= obstacle.y + 10 && // 允许10px的着陆容差
                  newVelocityY > 0) { // 只有下落时才能着陆
                  newY = obstacle.y - playerHeight
                  newVelocityY = 0
                  newIsJumping = false
                  newOnGround = true
                  landedOnObstacle = true
                  break
                }
              }

              if (!landedOnObstacle) {
                newY = testY
              }
            }
          } else {
            // 在地面或障碍物上时，检查是否仍有支撑
            let hasSupport = false

            // 检查地面支撑
            if (newY >= groundY - 5) {
              hasSupport = true
            } else {
              // 检查障碍物支撑
              for (const obstacle of obstacles) {
                if (newX + playerWidth > obstacle.x &&
                  newX < obstacle.x + obstacle.width &&
                  Math.abs(newY + playerHeight - obstacle.y) <= 5) {
                  hasSupport = true
                  break
                }
              }
            }

            // 如果没有支撑，开始下落
            if (!hasSupport) {
              newOnGround = false
              newVelocityY = 0
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
            onGround: newOnGround,
            facingDirection: newFacingDirection
          }
        })

        lastTime = currentTime
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [keys, isPaused, setPlayerPosition, checkCollision, obstacles])

  const handleBackToMenu = () => {
    resetGame()
    setIsGameOver(false) // 重置游戏结束状态
    setIsPaused(false) // 重置暂停状态
    setGameState('menu')
    if (onBackToMenu) {
      onBackToMenu()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // 获取当前游戏边界值的函数
  const getCurrentGameBoundary = useCallback(() => {
    if (gameCanvasRef.current) {
      const rect = gameCanvasRef.current.getBoundingClientRect()
      const actualCanvasWidth = rect.width
      return actualCanvasWidth - 48 - 50 // 增加安全边距，确保角色能触发游戏结束
    }
    return 900 // 调整默认值
  }, [])

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
      <div
        ref={gameCanvasRef}
        style={{
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
        {/* 游戏Canvas内容 */}
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
                scaleX: character.facingDirection,
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

            {/* 暂停/游戏结束遮罩 */}
            {(isPaused || isGameOver) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 cursor-pointer"
                onClick={isGameOver ? handleBackToMenu : togglePause}
              >
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white font-mono mb-4">
                    {isGameOver ? 'Game Over!' : 'Game Paused'}
                  </h2>
                  <p className="text-gray-300 font-mono mb-2">
                    {isGameOver
                      ? currentAction.replace('Game Over - ', '')
                      : 'Press ESC or click anywhere to continue'}
                  </p>
                  {isGameOver && (
                    <p className="text-yellow-300 font-mono text-sm">
                      🌟 Your adventurous spirit is commendable!
                    </p>
                  )}
                  {isGameOver && (
                    <button
                      onClick={handleBackToMenu}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 border border-white/40 rounded-lg text-white font-mono transition-all duration-200 transform hover:scale-105"
                    >
                      🏠 Back to Menu
                    </button>
                  )}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </Card>
  )
}

export default GameCanvas