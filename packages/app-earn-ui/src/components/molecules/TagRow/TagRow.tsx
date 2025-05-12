'use client'

import { type ReactNode } from 'react'
import clsx from 'clsx'

import styles from './TagRow.module.css'

export interface TagOption {
  label: ReactNode
  value: number
}

interface TagRowProps {
  options: TagOption[]
  selectedValue?: number | null
  onChange: (value: number) => void
  className?: string
}

export const TagRow = ({
  options,
  selectedValue,
  onChange,
  className,
}: TagRowProps): React.ReactNode => {
  return (
    <div className={clsx(styles.tagRow, className)} role="radiogroup" aria-label="Filter options">
      {options.map((option) => (
        <button
          key={option.value}
          className={clsx(styles.tag, {
            [styles.selected]: option.value === selectedValue,
          })}
          role="radio"
          aria-checked={option.value === selectedValue}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
