'use client'

import { Card, Typography, Progress, Skeleton, Empty, Image } from 'antd'
import { ThemePreviewProps } from '@/types'

const { Text } = Typography

const ThemePreview: React.FC<ThemePreviewProps> = ({
  isLoading,
  loadingProgress,
  gameData,
  selectedTheme,
  themes
}) => {
  const getPreviewImages = () => {
    if (selectedTheme && selectedTheme !== 'custom') {
      const theme = themes.find(t => t.id === selectedTheme)
      if (theme) {
        return {
          character: { url: theme.characterImage },
          background: { url: theme.backgroundImage },
          ground: { url: theme.groundImage },
          obstacle: { url: theme.obstacleImage }
        }
      }
    }
    // 适配新的数据结构
    if (gameData?.data) {
      return {
        character: { url: gameData.data.characterUrl },
        background: { url: gameData.data.backgroundUrl },
        ground: { url: gameData.data.groundUrl },
        obstacle: { url: gameData.data.obstacleUrl }
      }
    }
    return {
      character: null,
      background: null,
      ground: null,
      obstacle: null
    }
  }

  return (
    <Card
      title="Theme Preview"
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
                    <Image
                      src={getPreviewImages()?.character?.url}
                      alt="Character"
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '8px',
                        objectFit: 'cover'
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
                    <Image
                      src={getPreviewImages()?.background?.url}
                      alt="Background"
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '8px',
                        objectFit: 'cover'
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
              </div>
            </div>

            {/* 下半部分：地面纹理和障碍物 */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              {/* 左侧：地面纹理 */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '8px' }}>
                  <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Ground Texture</Text>
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
              </div>

              {/* 右侧：障碍物 */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '8px' }}>
                  <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Obstacle</Text>
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
      </div>
    </Card>
  )
}

export default ThemePreview