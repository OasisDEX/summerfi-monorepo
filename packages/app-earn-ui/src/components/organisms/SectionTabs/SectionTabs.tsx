'use client'
import { type CSSProperties, type ReactNode, useCallback, useState } from 'react'
import clsx from 'clsx'

import { Button } from '@/components/atoms/Button/Button'
import { Text } from '@/components/atoms/Text/Text'

import sectionTabsStyles from './SectionTabs.module.css'

type SectionTabsProps = {
  sections: {
    id: string
    title: string
    content: ReactNode
  }[]
  wrapperStyle?: CSSProperties
}

export const SectionTabs = ({ sections, wrapperStyle }: SectionTabsProps): ReactNode => {
  const [fadingOut, setFadingOut] = useState(false)
  const [activeSection, setActiveSection] = useState(sections[0].id)

  const handleSetActiveSection = useCallback(
    (sectionId: (typeof sections)[number]['id']) => {
      if (fadingOut) return
      setFadingOut(true)
      setTimeout(() => {
        setActiveSection(sectionId)
        setFadingOut(false)
      }, 200)
    },
    [fadingOut],
  )

  return (
    <div className={sectionTabsStyles.sectionTabWrapper} style={wrapperStyle}>
      <div className={sectionTabsStyles.sectionTabButtons}>
        {sections.map(({ id, title }) => (
          <Button
            key={`higher-yields-section-${id}`}
            onClick={() => handleSetActiveSection(id)}
            className={clsx(sectionTabsStyles.sectionTabButton, {
              [sectionTabsStyles.sectionTabButtonActive]: activeSection === id,
            })}
          >
            <Text variant={activeSection === id ? 'p1semiColorful' : 'p1semi'}>{title}</Text>
          </Button>
        ))}
      </div>
      <div
        className={clsx(sectionTabsStyles.sectionTabContent, {
          [sectionTabsStyles.sectionTabContentFadingOut]: fadingOut,
        })}
      >
        {sections.map(({ id, content }) => (
          <div
            key={`higher-yields-section-${id}`}
            style={{
              // needs this to prevent flash of old image when switching sections
              display: activeSection === id ? 'block' : 'none',
            }}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  )
}
