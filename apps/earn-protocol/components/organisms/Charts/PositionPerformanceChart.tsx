'use client'

import { useMemo } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type TimeframesType, type VaultWithChartsData } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { PerformanceChart } from '@/components/organisms/Charts/components/Performance'
import { POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'
import { useTimeframes } from '@/hooks/use-timeframes'

export type PositionPerformanceChartProps = {
  chartData: VaultWithChartsData['performanceChartData']
  inputToken: string
}

export const PositionPerformanceChart = ({
  chartData,
  inputToken,
}: PositionPerformanceChartProps) => {
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData,
  })

  const parsedData = useMemo(() => {
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe]
  }, [timeframe, chartData])

  const parsedDataWithCutoff =
    !chartData || chartData.data['7d'].length <= POINTS_REQUIRED_FOR_CHART['7d'] ? [] : parsedData

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
      <ChartHeader
        timeframes={timeframes}
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <PerformanceChart timeframe={timeframe} data={parsedDataWithCutoff} inputToken={inputToken} />
    </Card>
  )
}
