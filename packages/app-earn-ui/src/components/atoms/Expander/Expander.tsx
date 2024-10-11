'use client'
import { type FC, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'

import styles from './Expander.module.scss'

interface ExpanderProps {
  title: ReactNode
  defaultExpanded?: boolean
  children: ReactNode
}

export const Expander: FC<ExpanderProps> = ({ title, defaultExpanded = false, children }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [contentHeight, setContentHeight] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  // Function to recalculate height
  const recalculateHeight = useCallback(() => {
    if (contentRef.current) {
      setContentHeight(`${contentRef.current.scrollHeight}px`)
    }
  }, [])

  useEffect(() => {
    // Recalculate height whenever expanded state changes
    if (contentRef.current && isExpanded) {
      recalculateHeight()
    }
  }, [isExpanded, recalculateHeight])

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const contentElement = contentRef.current

    if (contentElement) {
      // Create a MutationObserver to observe changes inside the content (nested expanders)
      const observer = new MutationObserver(() => {
        // Recalculate height when changes are detected
        recalculateHeight()
      })

      // Observe child nodes and subtree changes (for nested expandable sections)
      observer.observe(contentElement, {
        childList: true,
        subtree: true,
      })

      return () => observer.disconnect()
    }
  }, [recalculateHeight])

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
      <div
        ref={contentRef}
        className={`${styles.expanderContent} ${!isExpanded ? styles.collapsed : ''}`}
        style={{
          maxHeight: isExpanded ? contentHeight ?? 'unset' : 0,
        }}
      >
        {children}
      </div>
    </div>
  )
}
