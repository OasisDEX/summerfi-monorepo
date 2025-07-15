'use client'
import { type FC, type ReactNode, useCallback, useState } from 'react'
import clsx from 'clsx'

import { Button } from '@/components/atoms/Button/Button'
import { Text } from '@/components/atoms/Text/Text'

import classNames from './MarketingPointsList.module.css'

export type MarketingPointsListData = { [key: string]: { title: string; content: ReactNode } }

interface MarketkingPointsListProps {
  data: MarketingPointsListData
  header?: string
  detailsWrapperClassName?: string
}

export const MarketingPointsList: FC<MarketkingPointsListProps> = ({
  data,
  header,
  detailsWrapperClassName,
}) => {
  const [fadingOut, setFadingOut] = useState(false)
  const blockSectionsKeys = Object.keys(data) as (keyof typeof data)[]
  const [activeSection, setActiveSection] = useState(blockSectionsKeys[0])

  const handleSetActiveSection = useCallback(
    (sectionKey: keyof typeof data) => {
      if (fadingOut) return
      setFadingOut(true)
      setTimeout(() => {
        setActiveSection(sectionKey)
        setFadingOut(false)
      }, 200)
    },
    [fadingOut],
  )

  return (
    <div>
      {header && (
        <div className={classNames.marketingPointsListHeaderWrapper}>
          <Text variant="h2">{header}</Text>
        </div>
      )}
      <div className={clsx(classNames.marketingPointsListDetailsWrapper, detailsWrapperClassName)}>
        <div className={classNames.marketingPointsListDetailsButtons}>
          {blockSectionsKeys.map((sectionKey) => (
            <Button
              key={`marketing-points-list-section-${sectionKey}`}
              onClick={() => handleSetActiveSection(sectionKey)}
              className={clsx(classNames.marketingPointsListDetailsButton, {
                [classNames.marketingPointsListDetailsButtonActive]: activeSection === sectionKey,
              })}
            >
              <Text
                variant={activeSection === sectionKey ? 'p1semiColorful' : 'p1semi'}
                style={{ whiteSpace: 'nowrap' }}
              >
                {data[sectionKey].title}
              </Text>
            </Button>
          ))}
        </div>
        <div
          className={clsx(classNames.marketingPointsListDetailsContent, {
            [classNames.marketingPointsListDetailsContentFadingOut]: fadingOut,
          })}
        >
          {blockSectionsKeys.map((sectionKey) => (
            <div
              key={`marketing-points-list-section-${sectionKey}`}
              style={{
                // needs this to prevent flash of old image when switching sections
                // also there was some issue with rendering icons when using display: none / block
                // therefore we use visibility and position
                visibility: activeSection === sectionKey ? 'visible' : 'hidden',
                position: activeSection === sectionKey ? 'relative' : 'absolute',
              }}
            >
              {data[sectionKey].content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
