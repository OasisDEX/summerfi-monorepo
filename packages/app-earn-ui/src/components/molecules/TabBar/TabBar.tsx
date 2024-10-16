'use client'
import React, { useEffect, useRef, useState } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import styles from './TabBar.module.scss'

interface Tab {
  label: string
  content: React.ReactNode
}

interface TabBarProps {
  tabs: Tab[]
}

export const TabBar: React.FC<TabBarProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    // Calculate the position and width of the underline based on the active tab
    const activeTab = tabRefs.current[activeIndex]

    if (activeTab) {
      setUnderlineStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      })
    }
  }, [activeIndex])

  return (
    <div className={styles.tabBar}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`${styles.tabButton} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <Text
              as="p"
              variant="p2semi"
              style={{
                color:
                  activeIndex === index
                    ? 'var(--earn-protocol-secondary-100)'
                    : 'var(--earn-protocol-secondary-60)',
              }}
            >
              {tab.label}
            </Text>
          </button>
        ))}
      </div>
      <div
        className={styles.underline}
        style={{ left: `${underlineStyle.left}px`, width: `${underlineStyle.width}px` }}
      />
      <div className={styles.tabContent}>{tabs[activeIndex].content}</div>
    </div>
  )
}
