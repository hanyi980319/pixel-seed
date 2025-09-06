'use client'

import React, { useState } from 'react'
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
  generateImages?: (requestBody: {
    theme: string;
    prompt: string;
    types: readonly ('character' | 'background' | 'ground' | 'obstacle')[];
  }) => Promise<any>
  onRegeneratingImagesChange?: (regeneratingImages: {
    character: boolean;
    background: boolean;
    ground: boolean;
    obstacle: boolean;
  }) => void
  themesListRef?: React.RefObject<HTMLDivElement | null>
  className?: string
  style?: React.CSSProperties
}

const SideMenu: React.FC<SideMenuProps> = ({
  onStartGame,
  onCreateTheme,
  onThemeUpdate,
  generateImages,
  onRegeneratingImagesChange,
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
    loadingMessage,
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
      setLoadingMessage('Generating your pixel world...')
      setGameState('loading')
      
      // Set all image types to regenerating state
      onRegeneratingImagesChange?.({
        character: true,
        background: true,
        ground: true,
        obstacle: true
      })
      
      setPresetThemes(updatedThemes)
      setSelectedTheme(loadingThemeId)
      onThemeUpdate?.(updatedThemes)

      const requestBody = {
        theme: isCustomTheme ? (customThemeName.trim() || 'custom') : selectedTheme,
        prompt: isCustomTheme ? customPrompt : selectedThemeInfo?.description || '',
        types: ['character', 'background', 'ground', 'obstacle'] as const
      }

      const result = generateImages ? await generateImages(requestBody) : null
      if (!result) {
        throw new Error('图像生成函数未提供')
      }

      if (result.success && result.data) {
        setGameData(result)
        setLoadingMessage('Generation complete!')

        // 更新全局状态中的处理后图像，确保新生成的图像能正确显示和持久化
        const { updateProcessedImage } = useGameStore.getState()
        if (result.data.characterUrl) {
          updateProcessedImage('character', result.data.characterUrl)
        }
        if (result.data.backgroundUrl) {
          updateProcessedImage('background', result.data.backgroundUrl)
        }
        if (result.data.groundUrl) {
          updateProcessedImage('ground', result.data.groundUrl)
        }
        if (result.data.obstacleUrl) {
          updateProcessedImage('obstacle', result.data.obstacleUrl)
        }

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
        
        // Reset regenerating images state
        onRegeneratingImagesChange?.({
          character: false,
          background: false,
          ground: false,
          obstacle: false
        })
        
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
      
      // Reset regenerating images state on error
      onRegeneratingImagesChange?.({
        character: false,
        background: false,
        ground: false,
        obstacle: false
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartGame = () => {
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
          selectedTheme={selectedTheme}
          customPrompt={customPrompt}
          customThemeName={customThemeName}
          apiKey={apiKey}
          onCreateTheme={handleCreateTheme}
          onStartGame={handleStartGame}
        />
      </div>
    </div>
  )
}

export default SideMenu