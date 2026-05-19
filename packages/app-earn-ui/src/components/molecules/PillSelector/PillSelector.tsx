'use client'
import { type CSSProperties, type FC, type ReactNode, useState } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import styles from './PillSelector.module.css'

type PillOption = {
  label?: ReactNode
  icon?: ReactNode
  value: string
}

type PillSelectorProps = {
  options: PillOption[]
  onSelect: (value: string) => void
  defaultSelected: string
  wrapperStyle?: CSSProperties
  selectedPillStyle?: CSSProperties
  pillStyle?: CSSProperties
}

export const PillSelector: FC<PillSelectorProps> = ({
  options,
  onSelect,
  defaultSelected,
  wrapperStyle,
  selectedPillStyle,
  pillStyle,
}) => {
  const [selected, setSelected] = useState<string>(defaultSelected)

  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect(value)
  }

  return (
    <div className={styles.pillContainer} style={wrapperStyle}>
      {options.map((option) => (
        <div
          key={option.value}
          className={`${styles.pill} ${selected === option.value ? styles.selected : ''}`}
          onClick={() => handleSelect(option.value)}
          style={selected === option.value ? { ...pillStyle, ...selectedPillStyle } : pillStyle}
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
