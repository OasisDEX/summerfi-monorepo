import { BonusLabel, Card, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './PortfolioRewardsBoost.module.scss'

const boostCards = [
  {
    deposits: '10',
    multiple: '1.5',
    link: '/',
  },
  {
    deposits: '2',
    multiple: '1.2',
    link: '/',
  },
]

export const PortfolioRewardsBoost = () => {
  return (
    <Card className={classNames.wrapper}>
      <Text as="h5" variant="h5" className={classNames.header}>
        Boost your $SUMR
      </Text>
      <Text as="p" variant="p2" className={classNames.description}>
        The Lazy Summer Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
      <Link href="/" className={classNames.link}>
        <WithArrow as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
          Learn more
        </WithArrow>
      </Link>
      <div className={classNames.boostCardsWrapper}>
        {boostCards.map((card) => (
          <Card key={card.deposits} className={classNames.boostCard} variant="cardSecondary">
            <Text as="h5" variant="h5">
              {card.deposits}+ Deposits
            </Text>
            <Link href={card.link}>
              <BonusLabel raw={`${card.multiple}x multiple`} />
            </Link>
          </Card>
        ))}
      </div>
    </Card>
  )
}
