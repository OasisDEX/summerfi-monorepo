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

import { HistoricalChart } from '@/components/organisms/Charts/components/Historical'

type PositionHistoricalChartProps = {
  chartData: SingleSourceChartData
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

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        padding: 0,
        position: 'relative',
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
