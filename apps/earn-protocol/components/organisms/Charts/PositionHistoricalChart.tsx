'use client'

import { useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type TimeframesType, type VaultWithChartsData } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { HistoricalChart } from '@/components/organisms/Charts/components/Historical'

export type PositionHistoricalChartProps = {
  chartData: VaultWithChartsData['historyChartData']
}

export const PositionHistoricalChart = ({ chartData }: PositionHistoricalChartProps) => {
  const [timeframe, setTimeframe] = useState<TimeframesType>('90d')

  const parsedData = useMemo(() => {
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe]
  }, [timeframe, chartData])

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
      <HistoricalChart timeframe={timeframe} data={parsedData} />
    </Card>
  )
}
