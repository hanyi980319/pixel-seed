'use client'

import { Card, Typography, Progress, Skeleton, Empty } from 'antd'
import { ThemePreviewProps } from '../types'

const { Text } = Typography

const ThemePreview: React.FC<ThemePreviewProps> = ({
  isGenerating,
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
          background: { url: theme.backgroundImage }
        }
      }
    }
    return gameData
  }

  return (
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
  )
}

export default ThemePreview