import { type FC } from 'react'
import { Card, DataBlock, TabBar } from '@summerfi/app-earn-ui'
import {
  formatDecimalAsPercent,
  formatFiatBalance,
  formatWithSeparators,
} from '@summerfi/app-utils'

import { MainHeader } from '@/components/layout/MainHeader/MainHeader'

import styles from './InsitutionPageView.module.css'

interface InsitutionPageViewProps {
  institutionName: string
  totalValue: number
  numberOfVaults: number
  thirtyDayAvgApy: number
  allTimePerformance: number
}

export const InsitutionPageView: FC<InsitutionPageViewProps> = ({
  institutionName,
  totalValue,
  numberOfVaults,
  thirtyDayAvgApy,
  allTimePerformance,
}) => {
  const dataBlocks = [
    {
      id: '1',
      title: 'Total value',
      value: `$${formatFiatBalance(totalValue)}`,
      gradient: 'var(--gradient-earn-protocol-light)',
      titleColor: 'var(--earn-protocol-secondary-60)',
    },
    {
      id: '2',
      title: 'Number of vaults',
      value: formatWithSeparators(numberOfVaults),
    },
    {
      id: '3',
      title: '30d avg APY',
      value: formatDecimalAsPercent(thirtyDayAvgApy),
    },
    {
      id: '4',
      title: 'All time performance',
      value: formatDecimalAsPercent(allTimePerformance),
    },
  ]

  const tabs = [
    {
      id: '1',
      label: 'Overview',
      content: <div>Overview</div>,
    },
    {
      id: '2',
      label: 'Vaults',
      content: <div>Vaults</div>,
    },
    {
      id: '3',
      label: 'Risk',
      content: <div>Risk</div>,
    },
    {
      id: '3',
      label: 'Fees & Revenue',
      content: <div>Risk</div>,
    },
    {
      id: '4',
      label: 'Reports',
      content: <div>Reports</div>,
    },
    {
      id: '5',
      label: 'News',
      content: <div>News</div>,
    },
  ]

  return (
    <div className={styles.institutionPageView}>
      <MainHeader institutionName={institutionName} />
      <div className={styles.dataBlocks}>
        {dataBlocks.map((block) => (
          <Card
            variant="cardSecondary"
            key={block.id}
            style={{ background: block.gradient, minHeight: '116px', flex: 1 }}
          >
            <DataBlock
              title={block.title}
              value={block.value}
              valueSize="large"
              titleSize="medium"
              titleStyle={{ color: block.titleColor }}
            />
          </Card>
        ))}
      </div>

      <TabBar tabs={tabs} />
    </div>
  )
}
