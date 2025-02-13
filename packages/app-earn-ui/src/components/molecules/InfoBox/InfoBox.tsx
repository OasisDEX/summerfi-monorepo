'use client'

import { type ReactNode } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'

import styles from './InfoBox.module.scss'

interface InfoBoxRow {
  label: string | ReactNode
  value: ReactNode | string | number
}

interface InfoBoxProps {
  title: string
  rows?: InfoBoxRow[]
  children?: ReactNode
  className?: string
  error?: string
}

export const InfoBox = ({ title, rows, children, className, error }: InfoBoxProps) => {
  return (
    <div className={clsx(styles.infoBox, className)}>
      <div className={styles.header}>
        <Text as="p" variant="p3semi" className={styles.title}>
          {title}
        </Text>
      </div>
      <div className={styles.content}>
        {rows ? (
          <div className={styles.rows}>
            {rows.map((row, index) => (
              <div key={index} className={styles.row}>
                <Text as="span" variant="p3semi">
                  {row.label}
                </Text>
                <Text as="span" variant="p3semi">
                  {row.value}
                </Text>
              </div>
            ))}
          </div>
        ) : (
          children
        )}
        {error && (
          <Text as="p" variant="p3" className={styles.error}>
            {error}
          </Text>
        )}
      </div>
    </div>
  )
}
