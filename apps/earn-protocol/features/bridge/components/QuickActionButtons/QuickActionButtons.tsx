'use client'
import React from 'react'
import { Button } from '@summerfi/app-earn-ui'
import styles from './QuickActionButtons.module.scss'

interface QuickActionButtonsProps {
  onSelect: (percentage: number) => void
}

const percentages = [0.25, 0.5, 0.75, 1]

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ onSelect }) => {
  return (
    <div className={styles.quickActionButtons}>
      {percentages.map((percent) => (
        <Button key={percent} variant="secondarySmall" onClick={() => onSelect(percent)}>
          {percent === 1 ? 'Max' : `${percent * 100}%`}
        </Button>
      ))}
    </div>
  )
}

export default QuickActionButtons
