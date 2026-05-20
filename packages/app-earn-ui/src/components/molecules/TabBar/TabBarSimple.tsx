'use client'

import { type CSSProperties, type FC, type ReactNode } from 'react'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import type TextClassNames from '@/components/atoms/Text/Text.module.css'

import styles from './TabBar.module.css'

interface Tab {
  id: string
  label: ReactNode
  icon?: ReactNode
  url?: string
}

interface TabBarProps {
  tabs: Tab[]
  textVariant?: keyof typeof TextClassNames
  tabHeadersStyle?: CSSProperties
  tabBarStyle?: CSSProperties
  activeTabId?: string
  onTabChange?: (tab: Tab) => void
}

const TabContent = ({
  tab,
  textVariant,
  activeTabId,
  onClick,
}: {
  tab: Tab
  textVariant: keyof typeof TextClassNames
  activeTabId?: string
  onClick?: () => void
}) => {
  return (
    <button
      className={`${styles.tabButton} ${activeTabId === tab.id ? styles.active : ''}`}
      style={
        {
          '--active-tab-color': '#ff0080',
          '--active-tab-width': activeTabId === tab.id ? '100%' : '0',
          '--active-tab-opacity': activeTabId === tab.id ? '1' : '0',
        } as CSSProperties
      }
      onClick={onClick}
    >
      <Text
        as={tab.icon ? 'div' : 'p'}
        variant={textVariant}
        style={{ display: 'flex', gap: 'var(--general-space-8)', alignItems: 'center' }}
      >
        {tab.label} {tab.icon}
      </Text>
    </button>
  )
}

export const TabBarSimple: FC<TabBarProps> = ({
  tabs,
  textVariant = 'p2semi',
  tabHeadersStyle,
  tabBarStyle,
  activeTabId,
  onTabChange,
}) => {
  return (
    <div className={styles.tabBar} style={tabBarStyle}>
      <div style={{ position: 'relative', height: 'fit-content', overflow: 'hidden' }}>
        <div className={styles.tabHeaders} style={tabHeadersStyle}>
          {tabs.map((tab) =>
            tab.url ? (
              <Link href={tab.url} key={`tab-${tab.id}`} onClick={() => onTabChange?.(tab)}>
                <TabContent tab={tab} textVariant={textVariant} activeTabId={activeTabId} />
              </Link>
            ) : (
              <TabContent
                key={`tab-${tab.id}`}
                tab={tab}
                textVariant={textVariant}
                activeTabId={activeTabId}
                onClick={() => onTabChange?.(tab)}
              />
            ),
          )}
        </div>
      </div>
    </div>
  )
}
