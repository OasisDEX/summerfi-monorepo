'use client'
import { type FC, type ReactNode, useCallback, useState } from 'react'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Icon } from '@/components/atoms/Icon/Icon'

import styles from './Expander.module.scss'

interface ExpanderProps {
  title: ReactNode
  defaultExpanded?: boolean
  children: ReactNode
}

export const Expander: FC<ExpanderProps> = ({ title, defaultExpanded = false, children }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  return (
    <div className={styles.expander}>
      <button className={styles.expanderButton} onClick={toggleExpand}>
        {title}
        <span className={styles.chevron}>
          <Icon
            iconName={isExpanded ? 'chevron_up' : 'chevron_down'}
            variant="xs"
            color="rgba(119, 117, 118, 1)"
          />
        </span>
      </button>
      <AnimateHeight id={`Expander_${typeof title === 'string' ? title : ''}`} show={isExpanded}>
        {children}
      </AnimateHeight>
    </div>
  )
}
