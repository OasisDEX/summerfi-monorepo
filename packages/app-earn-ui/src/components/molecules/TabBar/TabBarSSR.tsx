import { type CSSProperties, type FC } from 'react'
import clsx from 'clsx'
import { redirect } from 'next/navigation'

import { Text } from '@/components/atoms/Text/Text'

import styles from './TabBar.module.scss'
import { type ClassNames as TextClassNames } from '@/components/atoms/Text/Text.module.scss'

interface Tab {
  id: string
  label: string
}

interface TabBarSSRProps {
  tabs: Tab[]
  textVariant?: TextClassNames
  tabHeadersStyle?: CSSProperties
  selectedTab?: Tab['id']
  urlBase: string
}

export const TabBarSSR: FC<TabBarSSRProps> = ({
  tabs,
  textVariant = 'p2semi',
  tabHeadersStyle,
  selectedTab,
  urlBase,
}) => {
  const handleTabChange = (tab: Tab) => {
    redirect(`${urlBase}?tab=${tab.id}`)
  }

  return (
    <div className={styles.tabBar} style={{ marginBottom: 'var(--general-space-24)' }}>
      <div style={{ position: 'relative', height: 'fit-content', overflow: 'hidden' }}>
        <div className={styles.tabHeaders} style={tabHeadersStyle}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={clsx(styles.tabButton, {
                [styles.active]: selectedTab === tab.id,
              })}
              style={{
                padding: '0 0 10px 0',
                margin: '10px 20px 0 10px',
              }}
              onClick={() => handleTabChange(tab)}
            >
              <Text as="p" variant={textVariant}>
                {tab.label}
              </Text>
              {selectedTab === tab.id && (
                <p className={styles.underline} style={{ width: '100%' }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
