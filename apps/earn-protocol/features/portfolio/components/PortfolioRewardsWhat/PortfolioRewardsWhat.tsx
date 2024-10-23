import { Card, Table, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { sumrRewardsColumns } from '@/features/portfolio/components/PortfolioRewardsWhat/columns'

import classNames from './PortfolioRewardsWhat.module.scss'

export const PortfolioRewardsWhat = () => {
  return (
    <Card className={classNames.wrapper}>
      <Text as="h5" variant="h5" className={classNames.header}>
        What are $SUMR?
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
      <Table rows={[]} columns={sumrRewardsColumns} />
    </Card>
  )
}
