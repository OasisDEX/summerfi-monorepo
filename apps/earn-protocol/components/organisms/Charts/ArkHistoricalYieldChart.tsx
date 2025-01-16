'use client'

import { useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type TimeframesType, type VaultWithChartsData } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { NotEnoughData } from '@/components/organisms/Charts/components/NotEnoughData'
import { YieldsChart } from '@/components/organisms/Charts/components/Yields'
import { DAYS_TO_WAIT_FOR_CHART, POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'

type ArkHistoricalYieldChartProps = {
  chartData: VaultWithChartsData['arksHistoricalChartData']
  summerVaultName: string
}

export const ArkHistoricalYieldChart = ({
  chartData,
  summerVaultName,
}: ArkHistoricalYieldChartProps) => {
  const [timeframe, setTimeframe] = useState<TimeframesType>('90d')
  const [compare, setCompare] = useState(false)

  const colors = {
    [`${summerVaultName}`]: '#FF49A4',
    ...chartData?.colors,
  }

  const dataNames = [summerVaultName, ...(compare ? chartData?.dataNames ?? [] : [])]

  const parsedData = useMemo(() => {
    if (!chartData) {
      return []
    }

    if (!compare) {
      return chartData.data[timeframe].map((point) => ({
        timestamp: point.timestamp,
        [summerVaultName]: point[summerVaultName],
      }))
    }

    return chartData.data[timeframe]
  }, [timeframe, chartData, compare, summerVaultName])

  const parsedDataWithCutoff = parsedData.length <= POINTS_REQUIRED_FOR_CHART ? [] : parsedData

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        paddingBottom: 0,
        position: 'relative',
      }}
    >
      {!parsedDataWithCutoff.length && <NotEnoughData daysToWait={DAYS_TO_WAIT_FOR_CHART} />}
      <ChartHeader
        compare={compare}
        setCompare={(nextCompare) => setCompare(nextCompare)}
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <YieldsChart
        summerVaultName={summerVaultName}
        timeframe={timeframe}
        colors={colors}
        data={parsedDataWithCutoff}
        dataNames={dataNames}
      />
    </Card>
  )
}
