'use client'

import { useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type TimeframesType, type VaultWithChartsData } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { NotEnoughData } from '@/components/organisms/Charts/components/NotEnoughData'
import { PerformanceChart } from '@/components/organisms/Charts/components/Performance'
import { DAYS_TO_WAIT_FOR_CHART, POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'

export type PositionPerformanceChartProps = {
  chartData: VaultWithChartsData['performanceChartData']
  inputToken: string
}

export const PositionPerformanceChart = ({
  chartData,
  inputToken,
}: PositionPerformanceChartProps) => {
  const [timeframe, setTimeframe] = useState<TimeframesType>('90d')

  const parsedData = useMemo(() => {
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe]
  }, [timeframe, chartData])

  const parsedDataWithCutoff = parsedData.length <= POINTS_REQUIRED_FOR_CHART ? [] : parsedData

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingBottom: 0,
        position: 'relative',
      }}
    >
      {!parsedDataWithCutoff.length && <NotEnoughData daysToWait={DAYS_TO_WAIT_FOR_CHART} />}
      <ChartHeader
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <PerformanceChart timeframe={timeframe} data={parsedDataWithCutoff} inputToken={inputToken} />
    </Card>
  )
}
