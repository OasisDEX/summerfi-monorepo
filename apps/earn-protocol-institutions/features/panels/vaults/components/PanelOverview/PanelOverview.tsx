'use client'

import { Card, Text } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'
import { type NavPriceChartData } from '@summerfi/app-types/types/src/earn-protocol'

import { ChartHeader } from '@/components/molecules/Charts/ChartHeader'
import { NavPriceChart } from '@/components/molecules/Charts/NavPriceChart'
import { useTimeframes } from '@/hooks/useTimeframes'

import styles from './PanelOverview.module.css'

export const PanelOverview = ({ navChartData }: { navChartData?: NavPriceChartData }) => {
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: navChartData?.data,
  })

  return (
    <Card variant="cardSecondary" className={styles.panelOverviewWrapper}>
      <div className={styles.panelOverviewItem}>
        <div className={styles.panelOverviewHeader}>
          <Text as="h5" variant="h5">
            Performance
          </Text>
          <ChartHeader
            timeframes={timeframes}
            timeframe={timeframe}
            setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
            wrapperStyle={{
              justifyContent: 'flex-end',
            }}
          />
        </div>
        <Card>
          <NavPriceChart chartData={navChartData} timeframe={timeframe} />
        </Card>
        <Card>APY Charts (all time) for the Vault</Card>
      </div>
      <div className={styles.panelOverviewItem}>
        <Text as="h5" variant="h5">
          AUM (Bn’s)
        </Text>
        <Card>TVL of the Vault over time</Card>
      </div>
    </Card>
  )
}
