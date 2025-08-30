'use client'

import { Button, Typography, Space, Card, Row, Col, Radio, Input, Progress, Divider } from 'antd'
import { PlayCircleOutlined, CrownOutlined, RobotOutlined, EditOutlined, CheckOutlined, ReloadOutlined, ArrowLeftOutlined, PauseOutlined, ReloadOutlined as RestartOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useGameStore, GameTheme } from '@/lib/store'
import GameInterface from './GameInterface'

const { Title, Text } = Typography
const { TextArea } = Input

const MainMenu = () => {
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
    setGameData
  } = useGameStore()

  const [showCustomInput, setShowCustomInput] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGameInterface, setShowGameInterface] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const presetThemes = [
    {
      id: 'epic-fantasy' as GameTheme,
      name: 'Epic Fantasy',
      description: 'A fantasy world of magic, dragons, castles, and forests',
      icon: <CrownOutlined />,
      examples: ['Wizard', 'Dragon', 'Elven Forest', 'Ancient Castle']
    },
    {
      id: 'cyberpunk' as GameTheme,
      name: 'Cyberpunk',
      description: 'A sci-fi world of neon lights, machinery, and future cities',
      icon: <RobotOutlined />,
      examples: ['Cyber Warrior', 'Neon Street', 'Cyberspace', 'Future City']
    }
  ]

  const handleThemeSelect = (themeId: GameTheme) => {
    setSelectedTheme(themeId)
    if (themeId === 'custom') {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
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

    // 模拟生成进度
     let currentProgress = 0
     const interval = setInterval(() => {
       currentProgress += Math.random() * 15
       if (currentProgress >= 100) {
         clearInterval(interval)
         setLoadingProgress(100)
         setIsGenerating(false)
         setShowGameInterface(true) // 显示游戏界面
         setGameState('playing')
       } else {
         setLoadingProgress(Math.round(currentProgress * 100) / 100) // 保留两位小数
       }
     }, 200)
  }

  const getSelectedThemeInfo = () => {
    if (selectedTheme === 'custom') {
      return {
        name: 'Custom Theme',
        description: customPrompt || 'Enter your custom theme description',
        examples: ['Your', 'Custom', 'Elements', 'Here']
      }
    }
    return presetThemes.find(theme => theme.id === selectedTheme) || presetThemes[0]
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Title level={1}>PIXEL SEED</Title>
          <Text type="secondary">Grow infinite pixel worlds with an AI seed</Text>
        </div>

        {/* 左右分栏布局 */}
        <Row gutter={[24, 24]}>
          {/* 左侧：主题选择 */}
          {!showGameInterface && (
            <Col xs={24} lg={12}>
              <Card title="Choose Your Theme" style={{ height: '100%' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {/* 默认主题部分 */}
                  <div>
                    <Text strong>Default Themes</Text>
                    <Radio.Group
                      value={selectedTheme !== 'custom' ? selectedTheme : undefined}
                      onChange={(e) => handleThemeSelect(e.target.value)}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {presetThemes.map((theme) => (
                          <Card
                            key={theme.id}
                            size="small"
                            style={{
                              border: selectedTheme === theme.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleThemeSelect(theme.id)}
                          >
                            <Radio value={theme.id} style={{ width: '100%' }}>
                              <Space>
                                <div>
                                  <div style={{ fontWeight: 'bold' }}>{theme.name}</div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>{theme.description}</div>
                                  <div style={{ marginTop: '4px' }}>
                                    {theme.examples.map((example, index) => (
                                      <span key={index} style={{
                                        display: 'inline-block',
                                        background: '#f0f0f0',
                                        padding: '2px 6px',
                                        margin: '2px',
                                        borderRadius: '4px',
                                        fontSize: '10px'
                                      }}>
                                        {example}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </Space>
                            </Radio>
                          </Card>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>

                  <Divider />

                  {/* 自定义主题部分 */}
                  <div>
                    <Space align="baseline" style={{ marginBottom: '8px' }}>
                      <Radio
                        checked={selectedTheme === 'custom'}
                        onChange={() => handleThemeSelect('custom')}
                      />
                      <Text strong>
                        <EditOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                        Custom Theme
                      </Text>
                    </Space>
                    <TextArea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g., A steampunk floating city with airships and gear machinery..."
                      rows={3}
                      maxLength={200}
                      showCount
                      disabled={selectedTheme !== 'custom'}
                      style={{ opacity: selectedTheme !== 'custom' ? 0.6 : 1 }}
                    />
                  </div>

                  {/* 底部按钮 */}
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      style={{ marginRight: '8px' }}
                      onClick={() => {
                        // 确定按钮逻辑
                        console.log('确定选择主题');
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        // 重试按钮逻辑
                        setCustomPrompt('');
                        setSelectedTheme('epic-fantasy');
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </Space>
              </Card>
            </Col>
          )}

          {/* 右侧：游戏预览 */}
          <Col xs={24} lg={showGameInterface ? 24 : 12}>
            <Card
              title={showGameInterface ? "Pixel World Game" : "Game Preview"}
              style={{ height: '100%' }}
              extra={showGameInterface ? (
                <Space>
                  <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => {
                      setShowGameInterface(false)
                      setIsGenerating(false)
                      setLoadingProgress(0)
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type="text"
                    icon={isPaused ? <PlayCircleOutlined /> : <PauseOutlined />}
                    onClick={() => setIsPaused(!isPaused)}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    type="text"
                    icon={<RestartOutlined />}
                    onClick={() => {
                      setShowGameInterface(false)
                      setIsGenerating(false)
                      setLoadingProgress(0)
                    }}
                  >
                    Restart
                  </Button>
                </Space>
              ) : null}
            >
              {showGameInterface ? (
                <div style={{ height: '600px', position: 'relative' }}>
                  <GameInterface />
                </div>
              ) : !isGenerating ? (
                <div style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                  {/* 左右分栏区域 */}
                  <div style={{ flex: 1, display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    {/* 左侧：角色形象 */}
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Character</Text>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundImage: 'url(https://gw.alicdn.com/imgextra/i2/O1CN01tyxwk51DM6hF9S6DL_!!6000000000201-2-tps-1024-1024.png)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    </div>

                    {/* 右侧：关卡背景 */}
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Level Background</Text>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundImage: 'url(https://gw.alicdn.com/imgextra/i3/O1CN01hpClje1reVEd2Gkbu_!!6000000005656-2-tps-1024-1024.png)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    </div>
                  </div>

                  {/* 底部开始按钮 */}
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlayCircleOutlined />}
                      onClick={handleStartGame}
                      disabled={!selectedTheme || (selectedTheme === 'custom' && !customPrompt.trim())}
                      style={{ minWidth: '160px' }}
                    >
                      Start Game
                    </Button>

                    {/* 底部说明 */}
                    <div style={{ marginTop: '12px' }}>
                      <Space direction="vertical" size="small">
                        <Text type="secondary" style={{ fontSize: '12px' }}>A Seed, A World.</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Every generation is a unique creation</Text>
                      </Space>
                    </div>
                  </div>
                </div>
              ) : (
                /* 生成进度界面 */
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <Title level={3} style={{ marginBottom: '24px' }}>
                    Generating Your Pixel World
                  </Title>

                  <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <Text type="secondary">
                      Theme: {getSelectedThemeInfo().name}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontStyle: 'italic' }}>
                      "{getSelectedThemeInfo().description}"
                    </Text>
                  </div>

                  <Progress
                    percent={loadingProgress}
                    status={loadingProgress === 100 ? 'success' : 'active'}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    style={{ marginBottom: '16px' }}
                  />

                  <Text type="secondary">
                    {loadingMessage}
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default MainMenu