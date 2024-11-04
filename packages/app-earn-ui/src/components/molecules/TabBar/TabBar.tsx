'use client'
import { type FC, type ReactNode, useEffect, useRef, useState } from 'react'

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
}

export const TabBar: FC<TabBarProps> = ({ tabs, textVariant = 'p2semi' }) => {
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
      <div style={{ position: 'relative', height: 'fit-content' }}>
        <div className={styles.tabHeaders}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              // @ts-ignore
              ref={(el) => (tabRefs.current[index] = el)}
              className={`${styles.tabButton} ${activeIndex === index ? styles.active : ''}`}
              onClick={() => setActiveIndex(index)}
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
      <div className={styles.tabContent}>{tabs[activeIndex].content}</div>
    </div>
  )
}
