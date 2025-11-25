'use client'

import { useState } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'
import {
  type ArksHistoricalChartData,
  type SinglePointChartData,
} from '@summerfi/app-types/types/src/earn-protocol'

import { ArkHistoricalYieldChart } from '@/components/molecules/Charts/ArkHistoricalYieldChart'
import { AumChart } from '@/components/molecules/Charts/AumChart'
import { ChartHeader } from '@/components/molecules/Charts/ChartHeader'
import { NavPriceChart } from '@/components/molecules/Charts/NavPriceChart'
import { useTimeframes } from '@/hooks/useTimeframes'

import styles from './PanelOverview.module.css'

export const PanelOverview = ({
  navChartData,
  aumChartData,
  arksHistoricalChartData,
  summerVaultName,
}: {
  navChartData?: SinglePointChartData
  aumChartData?: SinglePointChartData
  arksHistoricalChartData?: ArksHistoricalChartData
  summerVaultName: string
}) => {
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: navChartData?.data,
  })

  const [compare, setCompare] = useState(false)

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
              width: '70%',
              justifyContent: 'space-between',
            }}
            checkboxValue={compare}
            setCheckboxValue={setCompare}
            checkboxLabel="Show ark APYs"
          />
        </div>
        <Card>
          <NavPriceChart
            chartData={navChartData}
            timeframe={timeframe}
            syncId="vault-overview-performance-chart"
          />
        </Card>
        <Card>
          <ArkHistoricalYieldChart
            chartData={arksHistoricalChartData}
            summerVaultName={summerVaultName}
            timeframe={timeframe}
            compare={compare}
            syncId="vault-overview-performance-chart"
          />
        </Card>
      </div>
      <div className={styles.panelOverviewItem}>
        <Text as="h5" variant="h5">
          AUM (Bn’s)
        </Text>
        <Card>
          <AumChart
            chartData={aumChartData}
            timeframe={timeframe}
            syncId="vault-overview-performance-chart"
          />
        </Card>
      </div>
    </Card>
  )
}
