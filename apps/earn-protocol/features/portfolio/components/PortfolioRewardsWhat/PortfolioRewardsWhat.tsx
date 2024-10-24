import { type FC, useMemo } from 'react'
import { Card, Table, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import type { PortfolioRewardsRawData } from '@/app/server-handlers/portfolio/portfolio-rewards-handler'
import { sumrRewardsColumns } from '@/features/portfolio/components/PortfolioRewardsWhat/columns'
import { portfolioRewardsMapper } from '@/features/portfolio/components/PortfolioRewardsWhat/mapper'

import classNames from './PortfolioRewardsWhat.module.scss'

interface PortfolioRewardsWhatProps {
  rewardsData: PortfolioRewardsRawData[]
}

export const PortfolioRewardsWhat: FC<PortfolioRewardsWhatProps> = ({ rewardsData }) => {
  const rows = useMemo(() => portfolioRewardsMapper(rewardsData), [rewardsData])

  return (
    <Card className={classNames.wrapper}>
      <Text as="h5" variant="h5" className={classNames.header}>
        What are $SUMR?
      </Text>
      <Text as="p" variant="p2" className={classNames.description}>
        The Summer Earn Protocol is a permissionless passive lending product, which sets out to
        offer effortless and secure optimised yield, while diversifying risk.
      </Text>
      <Link href="/" className={classNames.link}>
        <WithArrow as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-primary-100)' }}>
          Learn more
        </WithArrow>
      </Link>
      <Text as="h5" variant="h5">
        Positions earning $SUMR
      </Text>
      <Table rows={rows} columns={sumrRewardsColumns} />
    </Card>
  )
}
