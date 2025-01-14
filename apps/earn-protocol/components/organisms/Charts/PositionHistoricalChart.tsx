'use client'

import { useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type TimeframesType,
  type TokenSymbolsList,
  type VaultWithChartsData,
} from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import {
  DAYS_TO_WAIT_FOR_CHART,
  POINTS_REQUIRED_FOR_CHART,
} from '@/components/organisms/Charts/components/constants'
import { HistoricalChart } from '@/components/organisms/Charts/components/Historical'
import { NotEnoughData } from '@/components/organisms/Charts/components/NotEnoughData'

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

  const parsedDataWithCutoff = parsedData.length <= POINTS_REQUIRED_FOR_CHART ? [] : parsedData

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingBottom: 0,
        position: 'relative',
      }}
    >
      {!parsedDataWithCutoff.length && <NotEnoughData daysToWait={DAYS_TO_WAIT_FOR_CHART} />}
      <ChartHeader
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <HistoricalChart data={parsedDataWithCutoff} tokenSymbol={tokenSymbol} position={position} />
    </Card>
  )
}
