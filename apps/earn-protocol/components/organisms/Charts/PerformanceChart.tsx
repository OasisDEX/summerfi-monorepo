'use client'

import { useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type TimeframesType } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { PerformanceChart } from '@/components/organisms/Charts/components/Performance'

type PerformanceYieldChartProps = {
  chartData: []
}

export const PerformanceYieldChart = (_props: PerformanceYieldChartProps) => {
  const [timeframe, setTimeframe] = useState<TimeframesType>('90d')
  const [compare, setCompare] = useState(true)

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        paddingBottom: 0,
      }}
    >
      <ChartHeader
        compare={compare}
        setCompare={(nextCompare) => setCompare(nextCompare)}
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <PerformanceChart timeframe={timeframe} data={[]} />
    </Card>
  )
}
