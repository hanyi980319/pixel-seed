'use client'

import { Card, Space, Skeleton } from 'antd'
import { ThemesListProps } from './types'

const ThemesList: React.FC<ThemesListProps> = ({
  themes,
  selectedTheme,
  onThemeSelect
}) => {
  return (
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
        {themes.map((theme) => (
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
              onClick={() => !(theme as any).isLoading && onThemeSelect(theme.id)}
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
  )
}

export default ThemesList