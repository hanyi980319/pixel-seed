'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Settings, Pause, Play } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useGameStore } from '@/lib/store'

const GameInterface = () => {
  const {
    gameData,
    playerPosition,
    setPlayerPosition,
    setGameState,
    resetGame,
  } = useGameStore()

  const [isPaused, setIsPaused] = useState(false)
  const [currentAction, setCurrentAction] = useState('Idle')
  const [keys, setKeys] = useState<Set<string>>(new Set())

  // 键盘控制
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // 游戏循环
  useEffect(() => {
    if (isPaused) return

    const gameLoop = setInterval(() => {
      setPlayerPosition((prev: { x: number; y: number }) => {
        let newX = prev.x
        let newY = prev.y
        let action = 'idle'

        // 移动逻辑
        if (keys.has('a') || keys.has('arrowleft')) {
          newX = Math.max(0, newX - 5)
          action = 'Moving Left'
        }
        if (keys.has('d') || keys.has('arrowright')) {
          newX = Math.min(800, newX + 5)
          action = 'Moving Right'
        }
        if (keys.has('w') || keys.has('arrowup') || keys.has(' ')) {
          newY = Math.max(0, newY - 8)
          action = 'Jumping'
        }
        if (keys.has('s') || keys.has('arrowdown')) {
          newY = Math.min(400, newY + 5)
          action = 'Moving Down'
        }

        // 重力效果
        if (newY < 350) {
          newY += 3
        } else {
          newY = 350 // 地面高度
        }

        if (action === 'idle') {
          setCurrentAction('Idle')
        } else {
          setCurrentAction(action)
        }
        return { x: newX, y: newY }
      })
    }, 16) // 60 FPS

    return () => clearInterval(gameLoop)
  }, [keys, isPaused, setPlayerPosition])

  const handleBackToMenu = () => {
    resetGame()
    setGameState('menu')
  }

  const handleRestart = () => {
    resetGame()
    setGameState('menu')
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  if (!gameData) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <p className="text-white font-mono">Loading game data...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-slate-900 relative overflow-hidden">
      {/* 游戏画布 */}
      <div className="relative w-full h-full">
        {/* 背景层 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${gameData.background?.url || '/api/placeholder/background.png'})`,
            backgroundSize: 'cover',
          }}
        >
          {/* 背景渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
        </div>

        {/* 游戏区域 */}
        <div className="relative w-full h-full">
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
                backgroundImage: `url(${gameData.character?.actions?.[currentAction as keyof typeof gameData.character.actions] || gameData.character?.url || '/api/placeholder/character.png'})`,
              }}
            />
          </motion.div>

          {/* 地面指示线（开发用） */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" style={{ top: '370px' }} />
        </div>

        {/* 暂停遮罩 */}
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white font-mono mb-4">Game Paused</h2>
              <p className="text-gray-300 font-mono">Press ESC or click play button to continue</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 游戏UI */}
      <div className="absolute top-0 right-0 p-2 z-20">
        {/* 右侧信息面板 */}
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
            <span>WASD / Arrow keys: Move</span>
            <span>Space: Jump</span>
            <span>ESC: Pause</span>
          </div>
        </motion.div>
      </div>

      {/* 键盘事件处理 */}
      <div
        className="absolute inset-0 pointer-events-none"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            togglePause()
          }
        }}
        tabIndex={0}
      />
    </div>
  )
}

export default GameInterface