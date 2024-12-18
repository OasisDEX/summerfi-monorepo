'use client'

import { useMemo, useState } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import { type TimeframesType, type VaultWithChartsData } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { PerformanceChart } from '@/components/organisms/Charts/components/Performance'

export type PositionPerformanceChartProps = {
  chartData: VaultWithChartsData['performanceChartData']
}

export const PositionPerformanceChart = ({ chartData }: PositionPerformanceChartProps) => {
  const [timeframe, setTimeframe] = useState<TimeframesType>('90d')

  const parsedData = useMemo(() => {
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe]
  }, [timeframe, chartData])

  if (parsedData.length === 0) {
    return (
      <Card
        style={{
          marginTop: 'var(--spacing-space-medium)',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'var(--spacing-space-x-large)',
        }}
      >
        <Text variant="p3semi">No enough data available.</Text>
      </Card>
    )
  }

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingBottom: 0,
      }}
    >
      <ChartHeader
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <PerformanceChart timeframe={timeframe} data={parsedData} />
    </Card>
  )
}
