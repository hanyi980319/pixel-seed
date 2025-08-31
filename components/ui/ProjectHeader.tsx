'use client'

import { Typography } from 'antd'
import CurvedLoop from './CurvedLoop'
import ScrambledText from './ScrambleText'
import { ProjectHeaderProps } from '../types'

const { Title } = Typography

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ className }) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '50px'
      }}
    >
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
    </div>
  )
}

export default ProjectHeader