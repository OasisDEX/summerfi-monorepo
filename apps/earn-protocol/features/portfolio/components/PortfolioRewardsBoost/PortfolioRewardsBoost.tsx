import { Card, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import classNames from './PortfolioRewardsBoost.module.scss'

export const PortfolioRewardsBoost = () => {
  return (
    <Card className={classNames.wrapper}>
      <Text as="h5" variant="h5" className={classNames.header}>
        Boost your $SUMR
      </Text>
      <Text as="p" variant="p2" className={classNames.description}>
        The Summer Earn Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
      <Link href="/">
        <WithArrow as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
          Learn more
        </WithArrow>
      </Link>
    </Card>
  )
}
