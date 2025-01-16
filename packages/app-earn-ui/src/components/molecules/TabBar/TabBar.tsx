'use client'
import {
  type CSSProperties,
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

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
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  })
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

  const updateUnderlinePosition = useCallback(() => {
    const activeTab = tabRefs.current[resolvedActiveIndex]
    const tabHeaders = tabHeadersRef.current

    if (activeTab && tabHeaders) {
      const { scrollLeft } = tabHeaders

      setUnderlineStyle({
        left: activeTab.offsetLeft - scrollLeft,
        width: activeTab.offsetWidth,
      })
    }
  }, [resolvedActiveIndex])

  useEffect(() => {
    updateUnderlinePosition()

    const tabHeaders = tabHeadersRef.current

    if (tabHeaders) {
      tabHeaders.addEventListener('scroll', updateUnderlinePosition)

      return () => tabHeaders.removeEventListener('scroll', updateUnderlinePosition)
    }

    return () => null
  }, [resolvedActiveIndex, updateUnderlinePosition])

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
              <Text as="p" variant={textVariant}>
                {tab.label}
              </Text>
            </button>
          ))}
        </div>
        <div
          className={styles.underline}
          style={{
            left: `${underlineStyle.left}px`,
            width: `${underlineStyle.width}px`,
          }}
        />
      </div>
      <div className={styles.tabContent}>{tabs[resolvedActiveIndex].content}</div>
    </div>
  )
}
