'use client'

import { useMemo } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type SingleSourceChartData,
  type TimeframesType,
  type TokenSymbolsList,
} from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { HistoricalChart } from '@/components/organisms/Charts/components/Historical'
import { type HistoricalLegendItemKey } from '@/components/organisms/Charts/components/HistoricalLegend'
import { useTimeframes } from '@/hooks/use-timeframes'

type PositionHistoricalMarketValueChartProps = {
  chartData?: SingleSourceChartData
  position: {
    position: IArmadaPosition
    vault: SDKVaultishType
  }
  tokenSymbol: TokenSymbolsList
  chartId: string
  // Forwarded to HistoricalChart: show the legend values in the hover tooltip, and/or limit which
  // legend items are shown.
  legendInTooltip?: boolean
  legendItems?: HistoricalLegendItemKey[]
}

// The position's market value over time, reusing the portfolio's per-position history data
// (`SingleSourceChartData` with `netValue` + `depositedValue` series) and the same `HistoricalChart`
// renderer the portfolio uses. Mirrors PositionPerformanceChart's Card + ChartHeader + chart layout,
// but with no forecast — just the historic series plus a self-contained timeframe selector.
export const PositionHistoricalMarketValueChart = ({
  chartData,
  position,
  tokenSymbol,
  legendInTooltip,
  legendItems,
}: PositionHistoricalMarketValueChartProps) => {
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: chartData?.data,
  })

  const parsedData = useMemo(() => {
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe]
  }, [chartData, timeframe])

  const handleSetNextTimeframe = (nextTimeframe: string) => {
    setTimeframe(nextTimeframe as TimeframesType)
  }

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
        timeframes={timeframes}
        timeframe={timeframe}
        setTimeframe={handleSetNextTimeframe}
      />
      <HistoricalChart
        timeframe={timeframe}
        data={parsedData}
        tokenSymbol={tokenSymbol}
        portfolioPosition={position}
        legendInTooltip={legendInTooltip}
        legendItems={legendItems}
      />
    </Card>
  )
}
