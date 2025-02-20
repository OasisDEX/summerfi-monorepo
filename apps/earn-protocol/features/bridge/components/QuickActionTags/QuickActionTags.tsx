'use client'
import { type TagOption, TagRow } from '@summerfi/app-earn-ui'

import styles from './QuickActionTags.module.scss'

interface QuickActionTagsProps {
  onSelect: (percentage: number) => void
}

const quickActionOptions: TagOption[] = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: 'Max', value: 1 },
]

export const QuickActionTags: React.FC<QuickActionTagsProps> = ({ onSelect }) => {
  return (
    <div className={styles.quickActionTags}>
      <TagRow options={quickActionOptions} onChange={(value) => onSelect(Number(value))} />
    </div>
  )
}
