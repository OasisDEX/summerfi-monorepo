'use client'
import { type TagOption, TagRow } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import styles from './QuickActionTags.module.css'

interface QuickActionTagsProps {
  selectedValue: number | null
  onSelect: (percentage: number) => void
  customOptions?: TagOption[]
  wrapperClassName?: string
  tagRowClassName?: string
}

const quickActionOptions: TagOption[] = [
  { label: '25%', value: 25 },
  { label: '50%', value: 50 },
  { label: 'Max', value: 100 },
]

export const QuickActionTags: React.FC<QuickActionTagsProps> = ({
  selectedValue,
  onSelect,
  customOptions,
  wrapperClassName,
  tagRowClassName,
}) => {
  return (
    <div className={clsx(styles.quickActionTags, wrapperClassName)}>
      <TagRow
        options={customOptions ?? quickActionOptions}
        selectedValue={selectedValue}
        onChange={onSelect}
        className={tagRowClassName}
      />
    </div>
  )
}
