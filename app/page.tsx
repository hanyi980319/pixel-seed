'use client'

import React, { useState } from 'react'
import { Splitter } from 'antd'
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
    isLoading
  } = useGameStore()

  const [showGameInterface, setShowGameInterface] = useState(false)
  const [presetThemes, setPresetThemes] = useState(PRESET_THEMES)

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
            />
          </Splitter.Panel>

          <Splitter.Panel style={{ padding: '20px', overflowY: 'auto' }}>
            {!showGameInterface ? (
              <div style={{ display: 'flex', gap: '20px', width: '100%', height: '100%' }}>
                <ThemesList
                  themes={presetThemes}
                  selectedTheme={selectedTheme}
                  onThemeSelect={handleThemeSelect}
                />

                <ThemePreview
                  isGenerating={false}
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
            ) : (
              <GameCanvas
                isGenerating={false}
                loadingProgress={loadingProgress}
                loadingMessage={loadingMessage}
              />
            )}
          </Splitter.Panel>
        </Splitter>
      </div>
    </main>
  )
}
