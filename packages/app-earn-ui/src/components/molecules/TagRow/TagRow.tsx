'use client'

import { type ReactNode } from 'react'
import clsx from 'clsx'

import styles from './TagRow.module.scss'

export interface TagOption {
  label: ReactNode
  value: string | number
}

interface TagRowProps {
  options: TagOption[]
  selectedValue?: string | number
  onChange: (value: string | number) => void
  className?: string
}

export const TagRow = ({ options, selectedValue, onChange, className }: TagRowProps) => {
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
