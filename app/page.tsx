'use client'

import React, { useState, useRef } from 'react'
import { Splitter, message } from 'antd'
import { useGameStore, GameTheme } from '@/lib/store'
import {
  GameCanvas,
  SideMenu,
  ThemesList,
  ThemePreview,
} from '@/components/ui'
import { PRESET_THEMES } from '@/configs'

export default function Home() {
  const {
    selectedTheme,
    setSelectedTheme,
    loadingProgress,
    loadingMessage,
    gameData,
    isLoading,
    setLoading,
    setLoadingMessage
  } = useGameStore()

  const [showGameInterface, setShowGameInterface] = useState(false)
  const [presetThemes, setPresetThemes] = useState(PRESET_THEMES)
  const themesListRef = useRef<HTMLDivElement>(null)

  // Event handlers
  const handleThemeSelect = (themeId: GameTheme) => {
    setSelectedTheme(themeId)
  }

  const handleStartGame = () => {
    setShowGameInterface(true)
  }

  const handleBackToMenu = () => {
    setShowGameInterface(false)
  }

  const handleThemeUpdate = (themes: any[]) => {
    setPresetThemes(themes)
  }

  // Common image generation logic
  const generateImages = async (requestBody: {
    theme: string;
    prompt: string;
    types: readonly ('character' | 'background' | 'ground' | 'obstacle')[];
  }) => {
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
    
    return result
  }

  const handleRegenerateImage = async (themeId: string, imageType: 'character' | 'background' | 'ground' | 'obstacle') => {
    try {
      // Find the theme to regenerate
      const themeToRegenerate = presetThemes.find(theme => theme.id === themeId)
      if (!themeToRegenerate) {
        throw new Error('Theme not found')
      }
      
      const requestBody = {
        theme: themeToRegenerate.name || themeId,
        prompt: themeToRegenerate.description || '',
        types: [imageType] as const
      }
      
      const result = await generateImages(requestBody)
      
      if (result.success && result.data) {
        // Update the specific image in the theme
        const updatedThemes = presetThemes.map(theme => {
          if (theme.id === themeId) {
            const imageKey = `${imageType}Image`
            const urlKey = `${imageType}Url`
            return {
              ...theme,
              [imageKey]: result.data[urlKey] || theme[imageKey as keyof typeof theme]
            }
          }
          return theme
        })
        
        setPresetThemes(updatedThemes)
        
        message.success(`${imageType} regenerated successfully!`)
      }
    } catch (error) {
      console.error('Regeneration error:', error)
      message.error(error instanceof Error ? error.message : '图像重新生成失败')
    }
  }

  return (
    <main className="min-h-screen">
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Splitter
          style={{ height: '100vh' }}
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
            <SideMenu
              onStartGame={handleStartGame}
              onThemeUpdate={handleThemeUpdate}
              generateImages={generateImages}
              themesListRef={themesListRef}
            />
          </Splitter.Panel>

          <Splitter.Panel style={{ padding: '20px', overflowY: 'auto' }}>
            {!showGameInterface ? (
              <div style={{ display: 'flex', gap: '20px', width: '100%', height: '100%' }}>
                <ThemesList
                  ref={themesListRef}
                  themes={presetThemes}
                  selectedTheme={selectedTheme}
                  onThemeSelect={handleThemeSelect}
                />

                <ThemePreview
                  isLoading={isLoading}
                  loadingProgress={loadingProgress}
                  selectedTheme={selectedTheme}
                  themes={presetThemes}
                  gameData={gameData}
                  onRegenerateImage={handleRegenerateImage}
                />
              </div>
            ) : (
              <GameCanvas
                loadingProgress={loadingProgress}
                loadingMessage={loadingMessage}
                onBackToMenu={handleBackToMenu}
              />
            )}
          </Splitter.Panel>
        </Splitter>
      </div>
    </main>
  )
}
