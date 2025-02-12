'use client'
import React from 'react'
import { Text } from '@summerfi/app-earn-ui'
import styles from './ChainSelector.module.scss'

interface ChainSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const chainOptions = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'bsc', label: 'BSC' },
  { value: 'avalanche', label: 'Avalanche' },
]

export const ChainSelector: React.FC<ChainSelectorProps> = ({ label, value, onChange }) => {
  return (
    <div className={styles.chainSelector}>
      <Text variant="p3semi" as="label">
        {label}
      </Text>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={styles.select}>
        <option value="">Select network</option>
        {chainOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ChainSelector
