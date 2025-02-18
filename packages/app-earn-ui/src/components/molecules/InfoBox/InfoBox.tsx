'use client'

import { type ReactNode } from 'react'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import styles from './InfoBox.module.scss'

interface InfoBoxRow {
  label?: string | ReactNode
  value?: ReactNode | string | number
  type: 'entry' | 'separator'
}

interface InfoBoxProps {
  title?: string
  rows?: InfoBoxRow[]
  children?: ReactNode
  className?: string
  error?: string
}

export const InfoBox = ({ title, rows, children, className, error }: InfoBoxProps) => {
  return (
    <>
      {error && (
        <div className={styles.error}>
          <Icon iconName="warning" color="var(--earn-protocol-primary)" size={20} />
          <Text variant="p3" style={{ marginLeft: 'var(--general-space-12)' }}>
            {error}
          </Text>
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
