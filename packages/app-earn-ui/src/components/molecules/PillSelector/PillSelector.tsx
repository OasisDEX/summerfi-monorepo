'use client'
import { type FC, type ReactNode, useState } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import styles from './PillSelector.module.css'

type PillOption = {
  label?: string
  icon?: ReactNode
  value: string
}

type PillSelectorProps = {
  options: PillOption[]
  onSelect: (value: string) => void
  defaultSelected: string
}

export const PillSelector: FC<PillSelectorProps> = ({ options, onSelect, defaultSelected }) => {
  const [selected, setSelected] = useState<string>(defaultSelected)

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
  }

  return (
    <div className={styles.pillContainer}>
      {options.map((option) => (
        <div
          key={option.value}
          className={`${styles.pill} ${selected === option.value ? styles.selected : ''}`}
          onClick={() => handleSelect(option.value)}
        >
          {option.icon && option.icon}
          {option.label && (
            <Text as="p" variant="p4semi">
              {option.label}
            </Text>
          )}
        </div>
      ))}
    </div>
  )
}
