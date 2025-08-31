'use client'

import { Button, Typography, Space, Card, Row, Col, Radio, Input, Progress, Divider, Skeleton, Empty, Select, Splitter } from 'antd'
import { PlayCircleOutlined, CrownOutlined, RobotOutlined, EditOutlined, ReloadOutlined, ArrowLeftOutlined, PauseOutlined, ReloadOutlined as RestartOutlined } from '@ant-design/icons'
import { Sparkles, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useGameStore, GameTheme } from '@/lib/store'
import Canvas from './Canvas'
import CurvedLoop from './ui/CurvedLoop'
import Image from 'next/image'
import ScrambledText from './ui/ScrambleText'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const Menu = () => {
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
  const [presetThemes, setPresetThemes] = useState([
    {
      id: 'epic-fantasy' as GameTheme,
      name: 'Epic Fantasy',
      description: 'A fantasy world of magic, dragons, castles, and forests',
      icon: <CrownOutlined />,

      coverImage: 'https://img.alicdn.com/imgextra/i3/O1CN01oE45Og1lEV3Pj2zqD_!!6000000004787-2-tps-1664-928.png',
      characterImage: 'https://img.alicdn.com/imgextra/i2/O1CN01j9EfiV1OPjbhAHeK2_!!6000000001698-2-tps-1328-1328.png',
      backgroundImage: 'https://img.alicdn.com/imgextra/i3/O1CN01oE45Og1lEV3Pj2zqD_!!6000000004787-2-tps-1664-928.png'
    },
    {
      id: 'cyberpunk' as GameTheme,
      name: 'Cyberpunk',
      description: 'A sci-fi world of neon lights, machinery, and future cities',
      icon: <RobotOutlined />,

      coverImage: 'https://img.alicdn.com/imgextra/i2/O1CN01Wgbr5p1jMcqjUJhhX_!!6000000004534-2-tps-1664-928.png',
      characterImage: 'https://img.alicdn.com/imgextra/i4/O1CN01nHC1qf203FYtqGjDS_!!6000000006793-2-tps-1328-1328.png',
      backgroundImage: 'https://img.alicdn.com/imgextra/i2/O1CN01Wgbr5p1jMcqjUJhhX_!!6000000004534-2-tps-1664-928.png'
    },
    {
      id: 'western-world' as GameTheme,
      name: 'Western World',
      description: 'A wild west world of cowboys, saloons, desert landscapes, and frontier towns',
      icon: <EditOutlined />,

      coverImage: 'https://img.alicdn.com/imgextra/i1/O1CN015KYfWA1ajDqgDLuOe_!!6000000003365-2-tps-1664-928.png',
      characterImage: 'https://img.alicdn.com/imgextra/i1/O1CN01qffUt41LbEhpnCizQ_!!6000000001317-2-tps-1328-1328.png',
      backgroundImage: 'https://img.alicdn.com/imgextra/i1/O1CN015KYfWA1ajDqgDLuOe_!!6000000003365-2-tps-1664-928.png'
    },
    {
      id: 'underwater-world' as GameTheme,
      name: 'Underwater World',
      description: 'A mysterious underwater world of coral reefs, deep sea creatures, and ancient underwater civilizations',
      icon: <EditOutlined />,

      coverImage: 'https://img.alicdn.com/imgextra/i4/O1CN01ZLJHW326q9XwyXI4c_!!6000000007712-2-tps-1664-928.png',
      characterImage: 'https://img.alicdn.com/imgextra/i3/O1CN01k0uZLf1SMlVBXbKDG_!!6000000002233-2-tps-1328-1328.png',
      backgroundImage: 'https://img.alicdn.com/imgextra/i4/O1CN01ZLJHW326q9XwyXI4c_!!6000000007712-2-tps-1664-928.png'
    }
  ])

  const handleThemeSelect = (themeId: GameTheme) => {
    setSelectedTheme(themeId)
    if (themeId === 'custom') {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
    }
  }

  const handleCreateTheme = async () => {
    // 检查是否有自定义输入内容
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

      // 立即添加Loading状态的卡片到主题列表
      const loadingThemeId = `loading-${Date.now()}` as GameTheme
      const loadingTheme = {
        id: loadingThemeId,
        name: isCustomTheme ? (customThemeName.trim() || 'Custom Theme') : getSelectedThemeInfo().name,
        description: isCustomTheme ? customPrompt : getSelectedThemeInfo().description,
        icon: <EditOutlined />,
        examples: ['Generating...'],
        coverImage: '',
        characterImage: '',
        backgroundImage: '',
        isLoading: true
      } as any
      setPresetThemes(prev => [...prev, loadingTheme])
      setSelectedTheme(loadingThemeId)

      // 构建请求参数
      const requestBody = {
        theme: isCustomTheme ? (customThemeName.trim() || 'custom') : selectedTheme,
        prompt: isCustomTheme ? customPrompt : getSelectedThemeInfo().description,
        characterType: characterType,
        levelType: levelType
      }

      console.log('Calling API with:', requestBody)

      // 调用后端API
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

        // 更新Loading状态的主题为完成状态
        const finalThemeId = `custom-${Date.now()}` as GameTheme
        setPresetThemes(prev => prev.map(theme => {
          if ((theme as any).isLoading) {
            return {
              ...theme,
              id: finalThemeId,
              examples: ['Generated', 'Custom', 'AI', 'Theme'],
              coverImage: result.data.background?.url || '',
              characterImage: result.data.character?.url || '',
              backgroundImage: result.data.background?.url || '',
              isLoading: false
            } as any
          }
          return theme
        }))

        // 自动选中新创建的主题
        setSelectedTheme(finalThemeId)
        setIsThemeCreated(true)

        setGameState('menu')
      } else {
        throw new Error(result.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)

      // 移除Loading状态的主题
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

  const getPreviewImages = () => {
    if (selectedTheme && selectedTheme !== 'custom') {
      const theme = presetThemes.find(t => t.id === selectedTheme)
      if (theme) {
        return {
          character: { url: theme.characterImage },
          background: { url: theme.backgroundImage }
        }
      }
    }
    return gameData
  }

  // 如果显示游戏界面，只显示左侧栏和Canvas
  if (showGameInterface) {
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
            defaultSize={sidebarWidth}
            min={280}
            max={500}
            style={{
              backgroundColor: '#fff',
              borderRight: '1px solid #e8e8e8',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
              <div style={{ marginBottom: '20px', textAlign: 'center', padding: '16px', backgroundColor: '#f8f9ff', borderRadius: '8px' }}>
                <Title level={3} style={{ margin: 0, color: '#1890ff', fontSize: '20px' }}>PIXEL SEED</Title>
              </div>

              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => setShowGameInterface(false)}
                style={{ width: '100%', marginBottom: '16px' }}
              >
                Back to Menu
              </Button>
            </div>
          </Splitter.Panel>

          <Splitter.Panel>
            <Canvas />
          </Splitter.Panel>
        </Splitter>
      </div>
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
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {/* 项目名称和Slogan */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '50px' }}>
                <Title level={3} style={{ margin: 0, color: '#1890ff', fontSize: '20px' }}></Title>
                <ScrambledText
                  className="scrambled-text-demo"
                  radius={100}
                  duration={1.2}
                  speed={0.5}
                  scrambleChars={':.'}
                >
                  PIXEL SEED
                </ScrambledText>
                <CurvedLoop marqueeText="Grow infinite pixel worlds with an AI seed ✦" />
                {/* <CircularText
                  text="REACT*BITS*COMPONENTS*"
                  onHover="speedUp"
                  spinDuration={20}
                  className="custom-class"
                /> */}
              </div>

              {/* 模型选择 */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Model Selection</Text>
                <Select
                  value={selectedModel}
                  onChange={setSelectedModel}
                  style={{ width: '100%' }}
                  placeholder="Select a model"
                >
                  <Option value="Qwen-Image">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Image src="/qwen.svg" alt="Qwen" width={16} height={16} />
                      Qwen-Image
                    </div>
                  </Option>
                </Select>
              </div>

              {/* API KEY输入 */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>API Key</Text>
                <Input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  style={{ width: '100%' }}
                />
              </div>

              {/* 自定义主题名称 */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Custom Theme Name</Text>
                <Input
                  value={customThemeName}
                  onChange={(e) => setCustomThemeName(e.target.value)}
                  placeholder="Enter custom theme name"
                  style={{ width: '100%' }}
                />
              </div>

              {/* 自定义Prompt */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Custom Prompt</Text>
                <TextArea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter custom theme description"
                  rows={4}
                  style={{ width: '100%' }}
                />
              </div>

              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Button
                  type="default"
                  size="large"
                  icon={!isThemeCreated ? <Sparkles size={16} /> : <RotateCcw size={16} />}
                  onClick={handleCreateTheme}
                  loading={isLoading}
                  style={{ width: '100%', height: '48px' }}
                  disabled={selectedTheme === 'custom' && !customPrompt.trim()}
                >
                  {!isThemeCreated ? 'Create Theme' : 'Reset'}
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={handleStartGame}
                  loading={isGenerating}
                  style={{ width: '100%', height: '48px' }}
                >
                  {isGenerating ? 'Generating...' : 'Start Game'}
                </Button>
              </Space>

              {/* 生成进度 */}
              {isGenerating && (
                <div>
                  <Text style={{ fontSize: '12px', color: '#666' }}>{loadingMessage}</Text>
                  <Progress percent={loadingProgress} size="small" style={{ marginTop: '8px' }} />
                </div>
              )}
            </Space>
          </div>
        </Splitter.Panel >

        <Splitter.Panel style={{ padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '20px', width: '100%', height: '100%' }}>
            {/* Themes List Gallery */}
            <Card
              title="Themes List"
              style={{ width: '400px', height: '100%', display: 'flex', flexDirection: 'column' }}
              styles={{
                body: {
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitScrollbar: 'none'
                } as React.CSSProperties
              }}
            >
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {presetThemes.map((theme) => (
                  <div key={theme.id} style={{ width: '100%' }}>
                    <Card
                      hoverable={!(theme as any).isLoading}
                      size="small"
                      style={{
                        border: selectedTheme === theme.id ? '2px solid #1890ff' : '2px solid rgb(233, 236, 239)',
                        cursor: (theme as any).isLoading ? 'default' : 'pointer',
                        width: '100%',
                        opacity: (theme as any).isLoading ? 0.7 : 1
                      }}
                      onClick={() => !(theme as any).isLoading && handleThemeSelect(theme.id)}
                      cover={
                        <div style={{ height: '120px', overflow: 'hidden', position: 'relative' }}>
                          {(theme as any).isLoading ? (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f5f5f5'
                            }}>
                              <Skeleton.Image style={{ width: '100%', height: '100%' }} />
                            </div>
                          ) : (
                            <img
                              alt={theme.name}
                              src={theme.coverImage}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                      }
                    >
                      <Card.Meta
                        title={<span style={{ fontSize: '14px' }}>{theme.name}</span>}
                        description={
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            {theme.description}
                          </span>
                        }
                      />

                    </Card>
                  </div>
                ))}
              </Space>
            </Card>

            {/* Theme Preview */}
            <Card
              title="Theme Preview"
              style={{
                flex: 1,
                height: '100%',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {!isGenerating ? (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* 左右分栏区域 */}
                    <div style={{ flex: 1, display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      {/* 左侧：角色形象 */}
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '8px' }}>
                          <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Character</Text>
                        </div>
                        {isLoading ? (
                          <div
                            className="skeleton-image-full"
                            style={{
                              width: '100%',
                              aspectRatio: '1',
                              borderRadius: '8px',
                              overflow: 'hidden'
                            }}
                          >
                            <Skeleton.Image
                              style={{
                                width: '100%',
                                height: '100%'
                              }}
                              active
                            />
                          </div>
                        ) : (
                          getPreviewImages()?.character?.url ? (
                            <div
                              style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                backgroundImage: `url(${getPreviewImages()?.character?.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5'
                              }}
                            >
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No Character"
                                style={{ margin: 0 }}
                              />
                            </div>
                          )
                        )}
                      </div>

                      {/* 右侧：关卡背景 */}
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '8px' }}>
                          <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Level Background</Text>
                        </div>
                        {isLoading ? (
                          <div
                            className="skeleton-image-full"
                            style={{
                              width: '100%',
                              aspectRatio: '1',
                              borderRadius: '8px',
                              overflow: 'hidden'
                            }}
                          >
                            <Skeleton.Image
                              style={{
                                width: '100%',
                                height: '100%'
                              }}
                              active
                            />
                          </div>
                        ) : (
                          getPreviewImages()?.background?.url ? (
                            <div
                              style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                backgroundImage: `url(${getPreviewImages()?.background?.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5'
                              }}
                            >
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No Background"
                                style={{ margin: 0 }}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* 底部：游戏信息 */}
                    <div style={{
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}>
                      <Text style={{ fontSize: '12px', color: '#666' }}>
                        Ready to start your pixel adventure! Click "Start Game" to begin.
                      </Text>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <Progress
                      type="circle"
                      percent={loadingProgress}
                      size={80}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                    <Text style={{ marginTop: '16px', fontSize: '14px' }}>
                      Generating your pixel world...
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </Splitter.Panel>
      </Splitter >
    </div >
  )
}

export default Menu