'use client'

import { useMemo } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type TimeframesType,
  type TokenSymbolsList,
  type VaultWithChartsData,
} from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { HistoricalChart } from '@/components/organisms/Charts/components/Historical'
import { POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'
import { useTimeframes } from '@/hooks/use-timeframes'

export type PositionHistoricalChartProps = {
  chartData: VaultWithChartsData['historyChartData']
  tokenSymbol: TokenSymbolsList
  position: {
    positionData: IArmadaPosition
    vaultData: SDKVaultishType
  }
}

export const PositionHistoricalChart = ({
  chartData,
  tokenSymbol,
  position,
}: PositionHistoricalChartProps) => {
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData,
  })

  const parsedData = useMemo(() => {
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe]
  }, [timeframe, chartData])

  const chartHidden = parsedData.length < POINTS_REQUIRED_FOR_CHART[timeframe]

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        paddingBottom: 0,
        position: 'relative',
        ...(chartHidden && {
          // so much hacks to just because the legend is used as a separate UI element
          // will need to refactor this
          paddingLeft: 0,
        }),
      }}
    >
      <div
        style={{
          marginLeft: '90px',
          marginBottom: '10px',
        }}
      >
        {!chartHidden && (
          <ChartHeader
            timeframes={timeframes}
            timeframe={timeframe}
            setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
          />
        )}
      </div>
      <HistoricalChart
        timeframe={timeframe}
        data={parsedData}
        tokenSymbol={tokenSymbol}
        position={position}
      />
    </Card>
  )
}
