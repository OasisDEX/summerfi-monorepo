'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type PerformanceChartData, type TimeframesType } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { PerformanceChart } from '@/components/organisms/Charts/components/Performance'
import { allTimeframesAvailable, useTimeframes } from '@/hooks/use-timeframes'

export type PositionPerformanceChartProps = {
  chartData: PerformanceChartData
  inputToken: string
}

export const PositionPerformanceChart = ({
  chartData,
  inputToken,
}: PositionPerformanceChartProps) => {
  const [showForecast, setShowForecast] = useState(false)
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: chartData.historic,
  })

  const parsedData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData) {
      return []
    }

    if (showForecast) {
      return chartData.forecast[timeframe]
    }

    return chartData.historic[timeframe]
  }, [timeframe, chartData, showForecast])

  const parsedTimeframes = useMemo(() => {
    return showForecast ? allTimeframesAvailable : timeframes
  }, [showForecast, timeframes])

  useEffect(() => {
    if (!parsedTimeframes[timeframe]) {
      setTimeframe('7d')
    }
  }, [showForecast, parsedTimeframes, timeframe, setTimeframe])

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        paddingBottom: 0,
        position: 'relative',
      }}
    >
      <ChartHeader
        timeframes={parsedTimeframes}
        timeframe={timeframe}
        checkboxValue={showForecast}
        setCheckboxValue={(nextShowForecast) => setShowForecast(nextShowForecast)}
        checkboxLabel="Forecast"
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <PerformanceChart
        timeframe={timeframe}
        data={parsedData}
        inputToken={inputToken}
        showForecast={showForecast}
      />
    </Card>
  )
}
