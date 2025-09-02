'use client'

import { Typography, Select, Input } from 'antd'
import Image from 'next/image'
import { ModelSelectorProps } from '@/types'

const { Text } = Typography
const { Option } = Select

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  apiKey,
  onApiKeyChange
}) => {
  return (
    <>
      {/* 模型选择 */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>Model Selection</Text>
        <Select
          value={selectedModel}
          onChange={onModelChange}
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
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter your API key"
          style={{ width: '100%' }}
        />
      </div>
    </>
  )
}

export default ModelSelector