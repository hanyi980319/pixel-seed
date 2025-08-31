'use client'

import { Button, Typography, Splitter } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import Canvas from '../Canvas'
import { GameInterfaceProps } from '../types'

const { Title } = Typography

const GameInterface: React.FC<GameInterfaceProps> = ({
  sidebarWidth,
  onSidebarResize,
  onBackToMenu
}) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Splitter
        style={{ height: '100vh' }}
        onResize={(sizes) => {
          if (sizes && sizes[0]) {
            onSidebarResize(sizes[0])
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
            <div style={{
              marginBottom: '20px',
              textAlign: 'center',
              padding: '16px',
              backgroundColor: '#f8f9ff',
              borderRadius: '8px'
            }}>
              <Title level={3} style={{ margin: 0, color: '#1890ff', fontSize: '20px' }}>
                PIXEL SEED
              </Title>
            </div>

            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onBackToMenu}
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

export default GameInterface