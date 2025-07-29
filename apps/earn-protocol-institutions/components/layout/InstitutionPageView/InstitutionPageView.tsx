import { type FC } from 'react'
import { Card, DataBlock, TabBar } from '@summerfi/app-earn-ui'
import {
  formatDecimalAsPercent,
  formatFiatBalance,
  formatWithSeparators,
} from '@summerfi/app-utils'

import { MainHeader } from '@/components/layout/MainHeader/MainHeader'
import { DashboardOverview } from '@/features/dashboard/components/DashboardOverview/DashboardOverview'

import styles from './InstitutionPageView.module.css'

interface InstitutionPageViewProps {
  institutionName: string
  totalValue: number
  numberOfVaults: number
  thirtyDayAvgApy: number
  allTimePerformance: number
  vaultData: {
    name: string
    asset: string
    nav: number
    aum: number
    fee: number
    inception: number
  }
}

export const InstitutionPageView: FC<InstitutionPageViewProps> = ({
  institutionName,
  totalValue,
  numberOfVaults,
  thirtyDayAvgApy,
  allTimePerformance,
  vaultData,
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
      value: formatDecimalAsPercent(allTimePerformance, { plus: true }),
    },
  ]

  const tabs = [
    {
      id: '1',
      label: 'Overview',
      content: <DashboardOverview vaultData={vaultData} />,
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
      id: '4',
      label: 'Fees & Revenue',
      content: <div>Fees & Revenue</div>,
    },
    {
      id: '5',
      label: 'Reports',
      content: <div>Reports</div>,
    },
    {
      id: '6',
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
