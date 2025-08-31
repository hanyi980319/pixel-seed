'use client'

import { Typography, Input } from 'antd'
import { ThemeCustomizerProps } from '../types'

const { Text } = Typography
const { TextArea } = Input

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  customThemeName,
  onThemeNameChange,
  customPrompt,
  onPromptChange
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
    </>
  )
}

export default ThemeCustomizer