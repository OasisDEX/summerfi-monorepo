import { type FC } from 'react'
import { TabBar } from '@summerfi/app-earn-ui'

import { InstitutionPageDataBlocks } from '@/components/layout/InstitutionPageDataBlocks/InstitutionPageDataBlocks'
import { InstitutionPageHeader } from '@/components/layout/InstitutionPageHeader/InstitutionPageHeader'
import { DashboardFeesRevenue } from '@/features/dashboard/components/DashboardFeesRevenue/DashboardFeesRevenue'
import { DashboardNews } from '@/features/dashboard/components/DashboardNews/DashboardNews'
import { DashboardOverview } from '@/features/dashboard/components/DashboardOverview/DashboardOverview'
import { DashboardReports } from '@/features/dashboard/components/DashboardReports/DashboardReports'
import { DashboardRisk } from '@/features/dashboard/components/DashboardRisk/DashboardRisk'
import { DashboardVaults } from '@/features/dashboard/components/DashboardVaults/DashboardVaults'

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
  const tabs = [
    {
      id: '1',
      label: 'Overview',
      content: <DashboardOverview />,
    },
    {
      id: '2',
      label: 'Vaults',
      content: <DashboardVaults vaultData={vaultData} />,
    },
    {
      id: '3',
      label: 'Risk',
      content: <DashboardRisk />,
    },
    {
      id: '4',
      label: 'Fees & Revenue',
      content: <DashboardFeesRevenue />,
    },
    {
      id: '5',
      label: 'Reports',
      content: <DashboardReports />,
    },
    {
      id: '6',
      label: 'News',
      content: <DashboardNews />,
    },
  ]

  return (
    <div className={styles.institutionPageView}>
      <InstitutionPageHeader institutionName={institutionName} />
      <InstitutionPageDataBlocks
        totalValue={totalValue}
        numberOfVaults={numberOfVaults}
        thirtyDayAvgApy={thirtyDayAvgApy}
        allTimePerformance={allTimePerformance}
      />
      <TabBar tabs={tabs} />
    </div>
  )
}
