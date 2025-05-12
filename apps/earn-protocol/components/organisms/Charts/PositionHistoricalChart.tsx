'use client'

import { useMemo } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import {
  type HistoryChartData,
  type IArmadaPosition,
  type SDKVaultishType,
  type TimeframesType,
  type TokenSymbolsList,
} from '@summerfi/app-types'

import { HistoricalChart } from '@/components/organisms/Charts/components/Historical'
import { POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'

type PositionHistoricalChartProps = {
  chartData: HistoryChartData
  tokenSymbol: TokenSymbolsList
  position: {
    position: IArmadaPosition
    vault: SDKVaultishType
  }
  timeframe?: TimeframesType
}

import classNames from './PositionHistoricalChart.module.css'

export const PositionHistoricalChart = ({
  chartData,
  tokenSymbol,
  position,
  timeframe,
}: PositionHistoricalChartProps) => {
  const defaultTimeframe = '7d'

  const parsedData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe ?? defaultTimeframe]
  }, [chartData, timeframe])

  const chartHidden = parsedData.length < POINTS_REQUIRED_FOR_CHART[timeframe ?? defaultTimeframe]

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        paddingBottom: 0,
        position: 'relative',
        ...(chartHidden && {
          // so much hacks just because the legend is used as a separate UI element
          // will need to refactor this
          paddingLeft: 0,
        }),
      }}
      className={classNames.positionHistoricalChartWrapper}
    >
      <HistoricalChart
        timeframe={timeframe ?? defaultTimeframe}
        data={parsedData}
        tokenSymbol={tokenSymbol}
        portfolioPosition={position}
      />
    </Card>
  )
}
