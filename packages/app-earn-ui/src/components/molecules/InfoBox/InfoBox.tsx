'use client'

import { type ReactNode } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'

import styles from './InfoBox.module.scss'

interface InfoBoxProps {
  title?: string
  children: ReactNode
  className?: string
}

export const InfoBox = ({ title = 'Important info', children, className }: InfoBoxProps) => {
  return (
    <div className={clsx(styles.infoBox, className)}>
      <div className={styles.header}>
        <Text as="h3" variant="p2semi" className={styles.title}>
          {title}
        </Text>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
