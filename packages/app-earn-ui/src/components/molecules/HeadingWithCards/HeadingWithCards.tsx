'use client'
import { type FC } from 'react'
import Link from 'next/link'

import { Card } from '@/components/atoms/Card/Card.tsx'
import { Icon } from '@/components/atoms/Icon/Icon.tsx'
import { Text } from '@/components/atoms/Text/Text.tsx'
import { CopyToClipboard } from '@/components/molecules/CopyToClipboard/CopyToClipboard.tsx'

import classNames from './HeadingWithCards.module.scss'

interface HeadingWithSocialAndCardsProps {
  title: string
  description: string
  cards: { title: string; value: string; description: string }[]
  social: {
    linkToCopy: string
    linkToShare: string
  }
}

export const HeadingWithCards: FC<HeadingWithSocialAndCardsProps> = ({
  title,
  description,
  cards,
  social,
}) => {
  return (
    <div className={classNames.wrapper}>
      <div className={classNames.heading}>
        <Text as="h2" variant="h2">
          {title}
        </Text>
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
      </div>
      <Text as="p" variant="p2" className={classNames.description}>
        {description}
      </Text>
      <div className={classNames.cardsWrapper}>
        {cards.map((card) => (
          <Card key={card.title} className={classNames.card}>
            <Text as="p" variant="p2semi" className={classNames.cardTitle}>
              {card.title}
            </Text>
            <Text as="h4" variant="h4colorful">
              {card.value}
            </Text>
            <Text as="p" variant="p4semi" className={classNames.cardDescription}>
              {card.description}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  )
}
