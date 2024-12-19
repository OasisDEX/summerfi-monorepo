'use client'
import { type CSSProperties, type FC, type ReactNode, useEffect, useRef, useState } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import styles from './TabBar.module.scss'
import { type ClassNames as TextClassNames } from '@/components/atoms/Text/Text.module.scss'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabBarProps {
  tabs: Tab[]
  textVariant?: TextClassNames
  tabHeadersStyle?: CSSProperties
  defaultIndex?: number
  /**
  props below to use when using as controlled component
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
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const resolvedActiveIndex = useAsControlled ? defaultIndex : activeIndex

  const handleSetActive = (tab: Tab, idx: number) => {
    setActiveIndex(idx)
    handleTabChange?.(tab)
  }

  useEffect(() => {
    // Calculate the position and width of the underline based on the active tab
    const activeTab = tabRefs.current[resolvedActiveIndex]

    if (activeTab) {
      setUnderlineStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      })
    }
  }, [resolvedActiveIndex])

  return (
    <div className={styles.tabBar}>
      <div style={{ position: 'relative', height: 'fit-content' }}>
        <div className={styles.tabHeaders} style={tabHeadersStyle}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              // @ts-ignore
              ref={(el) => (tabRefs.current[index] = el)}
              className={`${styles.tabButton} ${resolvedActiveIndex === index ? styles.active : ''}`}
              onClick={() => handleSetActive(tab, index)}
            >
              <Text as="p" variant={textVariant}>
                {tab.label}
              </Text>
            </button>
          ))}
        </div>
        <div
          className={styles.underline}
          style={{ left: `${underlineStyle.left}px`, width: `${underlineStyle.width}px` }}
        />
      </div>
      <div className={styles.tabContent}>{tabs[resolvedActiveIndex].content}</div>
    </div>
  )
}
