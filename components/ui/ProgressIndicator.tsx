'use client'

import { Typography, Progress } from 'antd'
import { ProgressIndicatorProps } from '../types'

const { Text } = Typography

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isGenerating,
  loadingMessage,
  loadingProgress
}) => {
  if (!isGenerating) {
    return null
  }

  return (
    <div>
      <Text style={{ fontSize: '12px', color: '#666' }}>{loadingMessage}</Text>
      <Progress percent={loadingProgress} size="small" style={{ marginTop: '8px' }} />
    </div>
  )
}

export default ProgressIndicator