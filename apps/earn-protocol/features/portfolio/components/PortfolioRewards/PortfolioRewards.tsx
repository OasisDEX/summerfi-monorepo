import { Card, Text } from '@summerfi/app-earn-ui'

import classNames from './PortfolioRewards.module.scss'

export const PortfolioRewards = () => {
  return (
    <Card className={classNames.wrapper}>
      <Text as="h5" variant="h5" className={classNames.header}>
        What are $SUMR?
      </Text>
      <Text as="p" variant="p2" className={classNames.description}>
        The Summer Earn Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
    </Card>
  )
}
