'use client'

import { type CSSProperties, type FC, type ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { Text } from '@/components/atoms/Text/Text'
import type TextClassNames from '@/components/atoms/Text/Text.module.css'

import styles from './TabBar.module.css'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  url: string
}

interface TabBarProps {
  tabs: Tab[]
  textVariant?: keyof typeof TextClassNames
  tabHeadersStyle?: CSSProperties
  activeTabId?: string
}

export const TabBarSimple: FC<TabBarProps> = ({
  tabs,
  textVariant = 'p2semi',
  tabHeadersStyle,
  activeTabId,
}) => {
  const onTabClick = (tab: Tab) => {
    redirect(tab.url)
  }

  return (
    <div className={styles.tabBar}>
      <div style={{ position: 'relative', height: 'fit-content', overflow: 'hidden' }}>
        <div className={styles.tabHeaders} style={tabHeadersStyle}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`${styles.tabButton} ${activeTabId === tab.id ? styles.active : ''}`}
              onClick={() => onTabClick(tab)}
              style={
                {
                  '--active-tab-color': '#ff0080',
                  '--active-tab-width': activeTabId === tab.id ? '100%' : '0',
                  '--active-tab-opacity': activeTabId === tab.id ? '1' : '0',
                } as CSSProperties
              }
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
    </div>
  )
}
