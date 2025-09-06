'use client'

import { Typography, Input, InputNumber, message } from 'antd'
import { ThemeCustomizerProps } from '@/types'

const { Text } = Typography
const { TextArea } = Input

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  customThemeName,
  onThemeNameChange,
  customPrompt,
  onPromptChange,
  levelCount,
  onLevelCountChange
}) => {
  return (
    <>
      {/* 自定义主题名称 */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>Custom Theme Name</Text>
        <Input
          value={customThemeName}
          onChange={(e) => onThemeNameChange(e.target.value)}
          placeholder="Enter custom theme name"
          style={{ width: '100%' }}
        />
      </div>

      {/* 自定义Prompt */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>Custom Prompt</Text>
        <TextArea
          value={customPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Enter custom theme description"
          rows={4}
          style={{ width: '100%' }}
        />
      </div>

      {/* 关卡数量 */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>Level Count</Text>
        <InputNumber
          value={levelCount}
          onChange={(value) => {
            const newValue = value || 1
            onLevelCountChange?.(newValue)

            // 当用户输入值超过3时显示toast提示
            if (newValue > 3) {
              message.info('Generation results may take more time, please be patient', 3)
            }
          }}
          min={1}
          max={10}
          placeholder="Number of levels"
          style={{ width: '100%' }}
        />
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
          Generate 1-10 levels (default: 1)
        </Text>
      </div>
    </>
  )
}

export default ThemeCustomizer