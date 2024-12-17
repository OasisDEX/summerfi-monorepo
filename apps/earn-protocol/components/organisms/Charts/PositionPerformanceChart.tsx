'use client'

import { useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type TimeframesType, type VaultChartsPerformanceData } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { PerformanceChart } from '@/components/organisms/Charts/components/Performance'

export type PositionPerformanceChartProps = {
  chartData: VaultChartsPerformanceData['performanceChartData']
}

export const PositionPerformanceChart = ({ chartData }: PositionPerformanceChartProps) => {
  const [timeframe, setTimeframe] = useState<TimeframesType>('90d')
  const [compare, setCompare] = useState(true)

  const parsedData = useMemo(() => {
    if (!chartData) {
      return []
    }

    if (!compare) {
      return chartData.data[timeframe]
    }

    return chartData.data[timeframe]
  }, [timeframe, chartData, compare])

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
