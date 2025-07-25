'use client'
import { type CSSProperties, type FC, type ReactNode } from 'react'
import Link from 'next/link'

import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { CopyToClipboard } from '@/components/molecules/CopyToClipboard/CopyToClipboard'
import { DataBlock } from '@/components/molecules/DataBlock/DataBlock'

import classNames from './HeadingWithCards.module.css'

interface HeadingWithSocialAndCardsProps {
  title: string
  description: string
  cards?: { title: ReactNode; value: string; description: string }[]
  social?: {
    linkToCopy: string
    linkToShare: string
  }
  style?: CSSProperties
}

export const HeadingWithCards: FC<HeadingWithSocialAndCardsProps> = ({
  title,
  description,
  cards,
  social,
  style,
}) => {
  return (
    <div className={classNames.wrapper} style={style}>
      <div className={classNames.heading}>
        <Text as="h2" variant="h2">
          {title}
        </Text>
        {social && (
          <div className={classNames.headingIcons}>
            <CopyToClipboard textToCopy={social.linkToCopy}>
              <Icon iconName="social_link" variant="xl" />
            </CopyToClipboard>
            <Link
              href={social.linkToShare}
              style={{ display: 'flex', alignItems: 'center' }}
              target="_blank"
            >
              <Icon iconName="social_x" variant="xl" />
            </Link>
          </div>
        )}
      </div>
      <Text as="p" variant="p2" className={classNames.description}>
        {description}
      </Text>
      {cards && cards.length !== 0 && (
        <div className={classNames.cardsWrapper}>
          {cards.map((card) => (
            <Card key={card.value} className={classNames.card}>
              <DataBlock
                title={card.title}
                titleSize="medium"
                value={card.value}
                valueSize="largeColorful"
                subValue={card.description}
                subValueSize="small"
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
