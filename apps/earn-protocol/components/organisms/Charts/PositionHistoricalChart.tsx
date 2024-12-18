'use client'

import { useMemo, useState } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type TimeframesType,
  type TokenSymbolsList,
  type VaultWithChartsData,
} from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { HistoricalChart } from '@/components/organisms/Charts/components/Historical'

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
      <HistoricalChart data={parsedData} tokenSymbol={tokenSymbol} position={position} />
    </Card>
  )
}
