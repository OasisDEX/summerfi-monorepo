'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type PerformanceChartData, type TimeframesType } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { PerformanceChart } from '@/components/organisms/Charts/components/Performance'
import { allTimeframesAvailable, useTimeframes } from '@/hooks/use-timeframes'

type PositionPerformanceChartProps = {
  chartData: PerformanceChartData
  inputToken: string
}

export const PositionPerformanceChart = ({
  chartData,
  inputToken,
}: PositionPerformanceChartProps) => {
  const [showPastPerformance, setShowPastPerformance] = useState(false)
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: chartData.historic,
    customDefaultTimeframe: showPastPerformance ? undefined : '1y',
  })

  const parsedData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData) {
      return []
    }

    if (showPastPerformance) {
      return chartData.historic[timeframe]
    }

    return chartData.forecast[timeframe]
  }, [timeframe, chartData, showPastPerformance])

  const parsedTimeframes = useMemo(() => {
    return showPastPerformance ? timeframes : allTimeframesAvailable
  }, [showPastPerformance, timeframes])

  useEffect(() => {
    if (!parsedTimeframes[timeframe]) {
      setTimeframe('7d')
    }
  }, [showPastPerformance, parsedTimeframes, timeframe, setTimeframe])

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
        checkboxValue={showPastPerformance}
        setCheckboxValue={(nextShowPastPerformance) =>
          setShowPastPerformance(nextShowPastPerformance)
        }
        checkboxLabel="Show past performance"
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <PerformanceChart
        timeframe={timeframe}
        data={parsedData}
        inputToken={inputToken}
        showForecast={!showPastPerformance}
      />
    </Card>
  )
}
