'use client'
import { type CSSProperties, type FC, type ReactNode, useRef, useState } from 'react'

import { Text } from '@/components/atoms/Text/Text'
import type TextClassNames from '@/components/atoms/Text/Text.module.css'

import styles from './TabBar.module.css'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

interface TabBarProps {
  tabs: Tab[]
  textVariant?: keyof typeof TextClassNames
  tabHeadersStyle?: CSSProperties
  defaultIndex?: number
  /**
   * Props below to use when using as a controlled component
   */
  useAsControlled?: boolean
  handleTabChange?: (tab: Tab) => void
}

export const TabBar: FC<TabBarProps> = ({
  tabs,
  defaultIndex = 0,
  textVariant = 'p2semi',
  tabHeadersStyle,
  useAsControlled,
  handleTabChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabHeadersRef = useRef<HTMLDivElement | null>(null)

  const resolvedActiveIndex = useAsControlled ? defaultIndex : activeIndex

  const handleSetActive = (tab: Tab, idx: number) => {
    const activeTab = tabRefs.current[idx]
    const tabHeaders = tabHeadersRef.current

    if (activeTab && tabHeaders) {
      // Scroll the active tab into view
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }

    setActiveIndex(idx)
    handleTabChange?.(tab)
  }

  return (
    <div className={styles.tabBar}>
      <div style={{ position: 'relative', height: 'fit-content', overflow: 'hidden' }}>
        <div ref={tabHeadersRef} className={styles.tabHeaders} style={tabHeadersStyle}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              ref={(el) => {
                if (el) {
                  tabRefs.current[index] = el
                }
              }}
              className={`${styles.tabButton} ${resolvedActiveIndex === index ? styles.active : ''}`}
              onClick={() => handleSetActive(tab, index)}
            >
              <Text
                as={tab.icon ? 'div' : 'p'}
                variant={textVariant}
                style={{ display: 'flex', gap: 'var(--general-space-8)', alignItems: 'center' }}
              >
                {tab.label} {tab.icon}
              </Text>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.tabContent}>{tabs[resolvedActiveIndex].content}</div>
    </div>
  )
}
