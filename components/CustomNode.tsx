'use client'

import { Handle, Position } from '@xyflow/react'
import styles from './CustomNode.module.css'

interface CustomNodeProps {
  data: {
    label: string
    kind: string
    description?: string
    colors: {
      bg: string
      border: string
      text: string
    }
    selected?: boolean
  }
}

export function CustomNode({ data }: CustomNodeProps) {
  return (
    <div
      className={`${styles.node} ${data.selected ? styles.selected : ''}`}
      style={{
        background: data.colors.bg,
        borderColor: data.colors.border,
        boxShadow: data.selected 
          ? `0 0 20px ${data.colors.border}40, 0 0 40px ${data.colors.border}20`
          : `0 4px 12px rgba(0, 0, 0, 0.3)`,
      }}
    >
      <Handle type="target" position={Position.Left} className={styles.handle} />
      
      <div className={styles.header}>
        <span className={styles.kind} style={{ color: data.colors.text }}>
          {data.kind}
        </span>
      </div>
      
      <div className={styles.label} style={{ color: data.colors.text }}>
        {data.label}
      </div>
      
      {data.description && (
        <div className={styles.description}>
          {data.description.length > 80 
            ? data.description.slice(0, 80) + '...' 
            : data.description}
        </div>
      )}
      
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  )
}

