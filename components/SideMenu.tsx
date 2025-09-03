'use client'

import React, { useState, useRef } from 'react'
import { message } from 'antd'
import { useGameStore, GameTheme } from '@/lib/store'
import {
  ProjectHeader,
  ModelSelector,
  ThemeCustomizer,
  ActionButtons
} from './ui/index'
import { PRESET_THEMES } from '../configs'

export interface SideMenuProps {
  onStartGame?: () => void
  onCreateTheme?: () => void
  onThemeUpdate?: (themes: any[]) => void
  themesListRef?: React.RefObject<HTMLDivElement | null>
  className?: string
  style?: React.CSSProperties
}

const SideMenu: React.FC<SideMenuProps> = ({
  onStartGame,
  onCreateTheme,
  onThemeUpdate,
  themesListRef,
  className,
  style
}) => {
  const {
    selectedTheme,
    customPrompt,
    setSelectedTheme,
    setCustomPrompt,
    setGameState,
    loadingProgress,
    loadingMessage,
    setLoadingProgress,
    setLoadingMessage,
    gameData,
    setGameData,
    isLoading,
    setLoading,
    characterType,
    levelType
  } = useGameStore()

  // Local state management
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customThemeName, setCustomThemeName] = useState('')
  const [apiKey, setApiKey] = useState('sk-84083f55216c4c53ad9ebf77e3f2dc7f')
  const [selectedModel, setSelectedModel] = useState('Qwen-Image')
  const [isThemeCreated, setIsThemeCreated] = useState(false)
  const [presetThemes, setPresetThemes] = useState(PRESET_THEMES)

  // Event handlers
  const handleCreateTheme = async () => {
    // Check if user is trying to create a custom theme (either field has input)
    const hasCustomThemeName = customThemeName.trim() !== ''
    const hasCustomPrompt = customPrompt.trim() !== ''
    const isCustomTheme = hasCustomThemeName || hasCustomPrompt

    // Validation for custom theme - if user started entering custom theme, both fields are required
    if (isCustomTheme) {
      if (!customThemeName.trim()) {
        message.error('Please enter a custom theme name')
        return
      }
      if (!customPrompt.trim()) {
        message.error('Please enter a custom theme description')
        return
      }
    }

    const selectedThemeInfo = presetThemes.find(theme => theme.id === selectedTheme)
    const loadingThemeId = `loading-${Date.now()}` as GameTheme
    const loadingTheme = {
      id: loadingThemeId,
      name: isCustomTheme ? (customThemeName.trim() || 'Custom Theme') : selectedThemeInfo?.name || 'Unknown Theme',
      description: isCustomTheme ? customPrompt : selectedThemeInfo?.description || '',
      coverImage: '',
      characterImage: '',
      backgroundImage: '',
      isLoading: true
    } as any
    const updatedThemes = [...presetThemes, loadingTheme]
    
    try {
      setLoading(true)
      setLoadingProgress(0)
      setLoadingMessage('Generating your pixel world...')
      setGameState('loading')
      
      setPresetThemes(updatedThemes)
      setSelectedTheme(loadingThemeId)
      onThemeUpdate?.(updatedThemes)

      const requestBody = {
        theme: isCustomTheme ? (customThemeName.trim() || 'custom') : selectedTheme,
        prompt: isCustomTheme ? customPrompt : selectedThemeInfo?.description || '',
        types: ['character', 'background', 'ground', 'obstacle'] as const
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        if (response.status === 429 || (errorData && errorData.error && errorData.error.includes('rate limit'))) {
          throw new Error('API请求频率过高，请稍后再试')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        if (result.error && result.error.includes('rate limit')) {
          throw new Error('API请求频率过高，请稍后再试')
        }
        throw new Error(result.error || '图像生成失败')
      }

      if (result.success && result.data) {
        setGameData(result)
        setLoadingProgress(100)
        setLoadingMessage('Generation complete!')

        const finalThemeId = `custom-${Date.now()}` as GameTheme
        const finalUpdatedThemes = updatedThemes.map(theme => {
          if ((theme as any).isLoading) {
            return {
              ...theme,
              id: finalThemeId,
              characterImage: result.data.characterUrl || '',
              backgroundImage: result.data.backgroundUrl || '',
              groundImage: result.data.groundUrl || '',
              obstacleImage: result.data.obstacleUrl || '',
              isLoading: false
            } as any
          }
          return theme
        })
        setPresetThemes(finalUpdatedThemes)
        onThemeUpdate?.(finalUpdatedThemes)

        setSelectedTheme(finalThemeId)
        setIsThemeCreated(true)
        setGameState('menu')
        message.success('Theme created successfully!')
        
        // 滚动到主题列表底部
        setTimeout(() => {
          if (themesListRef?.current) {
            themesListRef.current.scrollTop = themesListRef.current.scrollHeight
          }
        }, 100)

        // Call external callback if provided
        onCreateTheme?.()
      } else {
        throw new Error(result.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Generation error:', error)
      message.error(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      const filteredThemes = updatedThemes.filter(theme => !(theme as any).isLoading)
      setPresetThemes(filteredThemes)
      onThemeUpdate?.(filteredThemes)
      setGameState('menu')
    } finally {
      setLoading(false)
    }
  }

  const handleStartGame = () => {
    if (selectedTheme === 'custom' && !customPrompt.trim()) {
      message.error('Please enter a custom theme description')
      return
    }

    // Set generating state
    setIsGenerating(true)
    setLoadingProgress(0)
    setLoadingMessage('Initializing generation...')
    setGameState('playing')

    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress >= 100) {
        clearInterval(interval)
        setLoadingProgress(100)
        setIsGenerating(false)
      } else {
        setLoadingProgress(Math.round(currentProgress * 100) / 100)
      }
    }, 200)

    // Call external callback if provided
    onStartGame?.()
  }

  return (
    <div
      className={className}
      style={{
        padding: '20px',
        height: '100%',
        overflowY: 'auto',
        ...style
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%'
      }}>
        <ProjectHeader />

        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />

        <ThemeCustomizer
          customThemeName={customThemeName}
          onThemeNameChange={setCustomThemeName}
          customPrompt={customPrompt}
          onPromptChange={setCustomPrompt}
        />

        <ActionButtons
          isThemeCreated={isThemeCreated}
          isLoading={isLoading}
          isGenerating={isGenerating}
          selectedTheme={selectedTheme}
          customPrompt={customPrompt}
          onCreateTheme={handleCreateTheme}
          onStartGame={handleStartGame}
        />
      </div>
    </div>
  )
}

export default SideMenu