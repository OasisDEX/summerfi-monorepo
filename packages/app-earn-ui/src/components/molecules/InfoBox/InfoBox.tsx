'use client'

import { type FC, type ReactNode } from 'react'
import clsx from 'clsx'

import { Text } from '@/components/atoms/Text/Text'
import { Alert } from '@/components/molecules/Alert/Alert'

import styles from './InfoBox.module.css'

interface InfoBoxRow {
  label?: ReactNode
  value?: ReactNode
  type: 'entry' | 'separator'
}

interface InfoBoxProps {
  title?: string
  rows?: InfoBoxRow[]
  children?: ReactNode
  className?: string
  error?: string
}

export const InfoBox: FC<InfoBoxProps> = ({ title, rows, children, className, error }) => {
  return (
    <>
      {error && (
        <div className={styles.error}>
          <Alert error={error} />
        </div>
      )}
      <div className={clsx(styles.infoBox, className)}>
        {title && (
          <div className={styles.header}>
            <Text as="p" variant="p3semi" className={styles.title}>
              {title}
            </Text>
          </div>
        )}
        <div className={clsx(styles.content, !title && styles.noTitle)}>
          {rows ? (
            <div className={styles.rows}>
              {rows.map((row, index) => (
                <div key={index} className={styles.row}>
                  {row.type === 'separator' ? (
                    <div className={styles.separator} />
                  ) : (
                    <>
                      <Text as="span" variant="p3semi">
                        {row.label}
                      </Text>
                      <Text
                        as="span"
                        variant="p3semi"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {row.value}
                      </Text>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </>
  )
}
