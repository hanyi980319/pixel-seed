'use client'

import { Card, Typography, Empty, Image, Button, Skeleton, message, Space } from 'antd'
import { RotateCcw, Trash2, Scissors } from 'lucide-react'
import { DownloadOutlined, RotateLeftOutlined, RotateRightOutlined, SwapOutlined, UndoOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { ThemePreviewProps } from '@/types'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/store'

const { Text } = Typography

const ThemePreview: React.FC<ThemePreviewProps> = ({
  isLoading,
  loadingMessage,
  gameData,
  selectedTheme,
  themes,
  regeneratingImages = { character: false, background: false, ground: false, obstacle: false },
  onRegenerateImage,
  onDeleteTheme
}) => {
  const [processingImages, setProcessingImages] = useState<{
    character: boolean;
    background: boolean;
    ground: boolean;
    obstacle: boolean;
  }>({ character: false, background: false, ground: false, obstacle: false })

  // 使用全局状态管理抠图结果
  const { getProcessedImagesForTheme, updateProcessedImage, loadFromLocalStorage } = useGameStore()

  // 组件加载时从localStorage恢复数据
  useEffect(() => {
    loadFromLocalStorage()
  }, [loadFromLocalStorage])
  const getPreviewImages = () => {
    let baseImages: any = {
      character: null,
      background: null,
      ground: null,
      obstacle: null
    }

    // 获取当前主题ID
    const currentThemeId = selectedTheme === 'custom' ? 'custom' : selectedTheme || 'fantasy'

    if (selectedTheme && selectedTheme !== 'custom') {
      const theme = themes.find(t => t.id === selectedTheme)
      if (theme) {
        baseImages = {
          character: { url: theme.characterImage },
          background: { url: theme.backgroundImage },
          ground: { url: theme.groundImage },
          obstacle: { url: theme.obstacleImage }
        }
      }
    }
    // 适配新的数据结构
    else if (gameData?.data) {
      baseImages = {
        character: { url: gameData.data.characterUrl },
        background: { url: gameData.data.backgroundUrl },
        ground: { url: gameData.data.groundUrl },
        obstacle: { url: gameData.data.obstacleUrl }
      }
    }

    // 获取当前主题的处理后图像
    const themeProcessedImages = getProcessedImagesForTheme(currentThemeId)

    // 使用处理后的图像URL覆盖原始URL
    return {
      character: themeProcessedImages.character ? { url: themeProcessedImages.character } : baseImages.character,
      background: themeProcessedImages.background ? { url: themeProcessedImages.background } : baseImages.background,
      ground: themeProcessedImages.ground ? { url: themeProcessedImages.ground } : baseImages.ground,
      obstacle: themeProcessedImages.obstacle ? { url: themeProcessedImages.obstacle } : baseImages.obstacle
    }
  }

  // 处理图像下载
  const handleDownloadImage = (imageUrl: string, imageType: string) => {
    if (!imageUrl) {
      message.error('No image to download')
      return
    }

    const suffix = imageUrl.slice(imageUrl.lastIndexOf('.')) || '.png'
    const filename = `${imageType}-${Date.now()}${suffix}`

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(blobUrl)
        link.remove()
        message.success(`${imageType} image downloaded successfully!`)
      })
      .catch((error) => {
        console.error('Error downloading image:', error)
        message.error(`Error downloading ${imageType} image`)
      })
  }

  // 自定义工具栏渲染函数
  const renderToolbar = (imageUrl: string, imageType: string) => {
    return (
      _: any,
      {
        transform: { scale },
        actions: {
          onFlipY,
          onFlipX,
          onRotateLeft,
          onRotateRight,
          onZoomOut,
          onZoomIn,
          onReset,
        },
      }: any
    ) => (
      <div className="toolbar-wrapper">
          <DownloadOutlined 
            onClick={() => handleDownloadImage(imageUrl, imageType)} 
          />
          <SwapOutlined 
            rotate={90} 
            onClick={onFlipY} 
          />
          <SwapOutlined 
            onClick={onFlipX} 
          />
          <RotateLeftOutlined 
            onClick={onRotateLeft} 
          />
          <RotateRightOutlined 
            onClick={onRotateRight} 
          />
          <ZoomOutOutlined 
            disabled={scale === 1} 
            onClick={onZoomOut} 
          />
          <ZoomInOutlined 
            disabled={scale === 50} 
            onClick={onZoomIn} 
          />
          <UndoOutlined 
            onClick={onReset} 
          />
        </div>
    )
  }

  // 处理手动抠图
  const handleProcessImage = async (imageType: 'character' | 'background' | 'ground' | 'obstacle') => {
    const images = getPreviewImages()
    const imageUrl = images?.[imageType]?.url

    if (!imageUrl) {
      message.error('No image to process')
      return
    }

    setProcessingImages(prev => ({ ...prev, [imageType]: true }))

    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          type: imageType
        })
      })

      const result = await response.json()

      if (result.success) {
        // 获取当前主题ID并保存抠图结果
        const currentThemeId = selectedTheme === 'custom' ? 'custom' : selectedTheme || 'fantasy'
        updateProcessedImage(currentThemeId, imageType, result.data.processedUrl)
        message.success(`${imageType} image processed successfully!`)
      } else {
        message.error(`Failed to process ${imageType} image: ${result.error}`)
      }
    } catch (error) {
      console.error('Error processing image:', error)
      message.error(`Error processing ${imageType} image`)
    } finally {
      setProcessingImages(prev => ({ ...prev, [imageType]: false }))
    }
  }

  // 判断当前主题是否可以删除（只有自定义主题可以删除）
  const canDeleteCurrentTheme = () => {
    return selectedTheme && typeof selectedTheme === 'string' && selectedTheme.startsWith('custom-')
  }

  // 获取删除按钮
  const getDeleteButton = () => {
    if (!canDeleteCurrentTheme() || !onDeleteTheme) {
      return null
    }

    return (
      <Button
        type="primary"
        danger
        icon={<Trash2 size={14} />}
        onClick={() => onDeleteTheme(selectedTheme as string)}
        title="删除主题"
      >
        Delete
      </Button>
    )
  }

  return (
    <Card
      title="Theme Preview"
      extra={getDeleteButton()}
      style={{
        flex: 1,
        height: '100%',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        body: {
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: 'none'
        } as React.CSSProperties
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* 上半部分：角色和背景 */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {/* 左侧：角色形象 */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '8px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Character</Text>
              </div>
              {(regeneratingImages.character || processingImages.character) ? (
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
                  <Image
                    src={getPreviewImages()?.character?.url}
                    alt="Character"
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                    preview={{
                      toolbarRender: renderToolbar(getPreviewImages()?.character?.url || '', 'character')
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
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
              {!regeneratingImages.character && !processingImages.character && getPreviewImages()?.character?.url && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <Button
                    size="small"
                    icon={<Scissors size={12} />}
                    onClick={() => handleProcessImage('character')}
                    style={{ padding: '4px 8px', height: '28px', fontSize: '12px' }}
                    title="Remove background"
                  >
                    Cutout
                  </Button>
                  {onRegenerateImage && (
                    <Button
                      size="small"
                      icon={<RotateCcw size={12} />}
                      onClick={() => onRegenerateImage(selectedTheme, 'character')}
                      style={{ padding: '4px 8px', height: '28px', fontSize: '12px' }}
                      loading={regeneratingImages.character}
                    >
                      Regenerate
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* 右侧：关卡背景 */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '8px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Level Background</Text>
              </div>
              {(regeneratingImages.background || processingImages.background) ? (
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
                  <Image
                    src={getPreviewImages()?.background?.url}
                    alt="Background"
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                    preview={{
                      toolbarRender: renderToolbar(getPreviewImages()?.background?.url || '', 'background')
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
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
              {!regeneratingImages.background && !processingImages.background && getPreviewImages()?.background?.url && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  {onRegenerateImage && (
                    <Button
                      size="small"
                      icon={<RotateCcw size={12} />}
                      onClick={() => onRegenerateImage(selectedTheme, 'background')}
                      style={{ padding: '4px 8px', height: '28px', fontSize: '12px' }}
                      loading={regeneratingImages.background}
                    >
                      Regenerate
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 下半部分：地面纹理和障碍物 */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {/* 左侧：地面纹理 */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '8px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Ground Texture</Text>
              </div>
              {(regeneratingImages.ground || processingImages.ground) ? (
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
                getPreviewImages()?.ground?.url ? (
                  <Image
                    src={getPreviewImages()?.ground?.url}
                    alt="Ground Texture"
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                    preview={{
                      toolbarRender: renderToolbar(getPreviewImages()?.ground?.url || '', 'ground')
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No Ground"
                      style={{ margin: 0 }}
                    />
                  </div>
                )
              )}
              {!regeneratingImages.ground && !processingImages.ground && getPreviewImages()?.ground?.url && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <Button
                    size="small"
                    icon={<Scissors size={12} />}
                    onClick={() => handleProcessImage('ground')}
                    style={{ padding: '4px 8px', height: '28px', fontSize: '12px' }}
                    title="Remove background"
                  >
                    Cutout
                  </Button>
                  {onRegenerateImage && (
                    <Button
                      size="small"
                      icon={<RotateCcw size={12} />}
                      onClick={() => onRegenerateImage(selectedTheme, 'ground')}
                      style={{ padding: '4px 8px', height: '28px', fontSize: '12px' }}
                      loading={regeneratingImages.ground}
                    >
                      Regenerate
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* 右侧：障碍物 */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '8px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Obstacle</Text>
              </div>
              {(regeneratingImages.obstacle || processingImages.obstacle) ? (
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
                getPreviewImages()?.obstacle?.url ? (
                  <Image
                    src={getPreviewImages()?.obstacle?.url}
                    alt="Obstacle"
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                    preview={{
                      toolbarRender: renderToolbar(getPreviewImages()?.obstacle?.url || '', 'obstacle')
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No Obstacle"
                      style={{ margin: 0 }}
                    />
                  </div>
                )
              )}
              {!regeneratingImages.obstacle && !processingImages.obstacle && getPreviewImages()?.obstacle?.url && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <Button
                    size="small"
                    icon={<Scissors size={12} />}
                    onClick={() => handleProcessImage('obstacle')}
                    style={{ padding: '4px 8px', height: '28px', fontSize: '12px' }}
                    title="Remove background"
                  >
                    Cutout
                  </Button>
                  {onRegenerateImage && (
                    <Button
                      size="small"
                      icon={<RotateCcw size={12} />}
                      onClick={() => onRegenerateImage(selectedTheme, 'obstacle')}
                      style={{ padding: '4px 8px', height: '28px', fontSize: '12px' }}
                      loading={regeneratingImages.obstacle}
                    >
                      Regenerate
                    </Button>
                  )}
                </div>
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
      </div>
    </Card>
  )
}

export default ThemePreview