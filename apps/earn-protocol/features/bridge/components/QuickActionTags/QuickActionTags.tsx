'use client'
import { type TagOption, TagRow } from '@summerfi/app-earn-ui'

import styles from './QuickActionTags.module.css'

interface QuickActionTagsProps {
  selectedValue: number | null
  onSelect: (percentage: number) => void
}

const quickActionOptions: TagOption[] = [
  { label: '25%', value: 25 },
  { label: '50%', value: 50 },
  { label: 'Max', value: 100 },
]

export const QuickActionTags: React.FC<QuickActionTagsProps> = ({ selectedValue, onSelect }) => {
  return (
    <div className={styles.quickActionTags}>
      <TagRow options={quickActionOptions} selectedValue={selectedValue} onChange={onSelect} />
    </div>
  )
}
