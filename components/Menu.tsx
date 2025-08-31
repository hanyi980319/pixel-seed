'use client'

import React, { useState } from 'react'
import { Splitter } from 'antd'
import { useGameStore, GameTheme } from '@/lib/store'
import {
  GameInterface,
  ProjectHeader,
  ModelSelector,
  ThemeCustomizer,
  ActionButtons,
  ProgressIndicator,
  ThemesList,
  ThemePreview,
  MenuProps
} from './ui'
import { PRESET_THEMES } from './config'

const Menu: React.FC<MenuProps> = () => {
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

  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customThemeName, setCustomThemeName] = useState('')
  const [showGameInterface, setShowGameInterface] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [apiKey, setApiKey] = useState('sk-84083f55216c4c53ad9ebf77e3f2dc7f')
  const [selectedModel, setSelectedModel] = useState('Qwen-Image')
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isThemeCreated, setIsThemeCreated] = useState(false)
  const [presetThemes, setPresetThemes] = useState(PRESET_THEMES)

  // Event handlers
  const handleThemeSelect = (themeId: GameTheme) => {
    setSelectedTheme(themeId)
    if (themeId === 'custom') {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
    }
  }

  const handleCreateTheme = async () => {
    const isCustomTheme = customPrompt.trim() !== ''

    if (isCustomTheme && !customPrompt.trim()) {
      alert('Please enter a custom theme description')
      return
    }

    try {
      setLoading(true)
      setLoadingProgress(0)
      setLoadingMessage('Generating your pixel world...')
      setGameState('loading')

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
      setPresetThemes(prev => [...prev, loadingTheme])
      setSelectedTheme(loadingThemeId)

      const requestBody = {
        theme: isCustomTheme ? (customThemeName.trim() || 'custom') : selectedTheme,
        prompt: isCustomTheme ? customPrompt : selectedThemeInfo?.description || '',
        characterType: characterType,
        levelType: levelType
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setGameData(result.data)
        setLoadingProgress(100)
        setLoadingMessage('Generation complete!')

        const finalThemeId = `custom-${Date.now()}` as GameTheme
        setPresetThemes(prev => prev.map(theme => {
          if ((theme as any).isLoading) {
            return {
              ...theme,
              id: finalThemeId,
              coverImage: result.data.background?.url || '',
              characterImage: result.data.character?.url || '',
              backgroundImage: result.data.background?.url || '',
              isLoading: false
            } as any
          }
          return theme
        }))

        setSelectedTheme(finalThemeId)
        setIsThemeCreated(true)
        setGameState('menu')
      } else {
        throw new Error(result.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setPresetThemes(prev => prev.filter(theme => !(theme as any).isLoading))
      setGameState('menu')
    } finally {
      setLoading(false)
    }
  }

  const handleStartGame = () => {
    if (selectedTheme === 'custom' && !customPrompt.trim()) {
      alert('Please enter a custom theme description')
      return
    }

    setIsGenerating(true)
    setLoadingProgress(0)
    setLoadingMessage('Initializing generation...')

    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress >= 100) {
        clearInterval(interval)
        setLoadingProgress(100)
        setIsGenerating(false)
        setShowGameInterface(true)
        setGameState('playing')
      } else {
        setLoadingProgress(Math.round(currentProgress * 100) / 100)
      }
    }, 200)
  }



  const handleBackToMenu = () => {
    setShowGameInterface(false)
  }

  const handleSidebarResize = (width: number) => {
    setSidebarWidth(width)
  }

  // Game Interface
  if (showGameInterface) {
    return (
      <GameInterface
        sidebarWidth={sidebarWidth}
        onSidebarResize={handleSidebarResize}
        onBackToMenu={handleBackToMenu}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Splitter
        style={{ height: '100vh' }}
        onResize={(sizes) => {
          if (sizes && sizes[0]) {
            setSidebarWidth(sizes[0])
          }
        }}
      >
        <Splitter.Panel
          defaultSize={400}
          min={350}
          max={450}
          style={{
            backgroundColor: '#fff',
            borderRight: '1px solid #e8e8e8',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
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

              <ProgressIndicator
                isGenerating={isGenerating}
                loadingMessage={loadingMessage}
                loadingProgress={loadingProgress}
              />
            </div>
          </div>
        </Splitter.Panel>

        <Splitter.Panel style={{ padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '20px', width: '100%', height: '100%' }}>
            <ThemesList
              themes={presetThemes}
              selectedTheme={selectedTheme}
              onThemeSelect={handleThemeSelect}
            />

            <ThemePreview
              isGenerating={isGenerating}
              isLoading={isLoading}
              loadingProgress={loadingProgress}
              selectedTheme={selectedTheme}
              themes={presetThemes}
              gameData={gameData ? {
                character: gameData.character ? { url: gameData.character.url } : undefined,
                background: gameData.background ? { url: gameData.background.url } : undefined
              } : undefined}
            />
          </div>
        </Splitter.Panel>
      </Splitter >
    </div >
  )
}

export default Menu