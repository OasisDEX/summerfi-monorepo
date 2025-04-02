'use client'

import { useMemo } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type InlineButtonOption,
  type TimeframesType,
} from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { NotEnoughData } from '@/components/organisms/Charts/components/NotEnoughData'
import { YieldsChart } from '@/components/organisms/Charts/components/Yields'
import { POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'
import { useTimeframes } from '@/hooks/use-timeframes'

type VaultDetailsHistoricalYieldChartProps = {
  chartData: ArksHistoricalChartData
  summerVaultName: string
  currentOptions: InlineButtonOption<string>[]
}

export const VaultDetailsHistoricalYieldChart = ({
  chartData,
  summerVaultName,
  currentOptions,
}: VaultDetailsHistoricalYieldChartProps) => {
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: chartData.data,
  })

  const colors = {
    [`${summerVaultName}`]: '#FF49A4',
    ...chartData.colors,
  }

  const dataNames = currentOptions.map((option) => option.key).includes('all')
    ? [summerVaultName, ...(chartData.dataNames ?? [])]
    : currentOptions.map((option) => option.key)

  const parsedData = useMemo(() => {
    if (!chartData) {
      return []
    }

    const selectedOptions = currentOptions.map((option) => option.key)

    // If 'all' is selected, include all available data
    if (selectedOptions.includes('all')) {
      return chartData.data[timeframe]
    }

    return chartData.data[timeframe].map((point) => {
      const filteredPoint: any = { timestamp: point.timestamp }

      // Include data for selected options
      selectedOptions.forEach((option) => {
        if (point[option] !== undefined) {
          filteredPoint[option] = point[option]
        }
      })

      return filteredPoint
    })
  }, [timeframe, chartData, currentOptions, summerVaultName])

  const parsedDataWithCutoff =
    !chartData || chartData.data['7d'].length <= POINTS_REQUIRED_FOR_CHART['7d'] ? [] : parsedData

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        background: 'unset',
        flexDirection: 'column',
        padding: 0,
        position: 'relative',
      }}
    >
      {!parsedDataWithCutoff.length && <NotEnoughData />}
      <ChartHeader
        timeframes={timeframes}
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
        wrapperStyle={{
          justifyContent: 'flex-end',
        }}
      />
      <YieldsChart
        summerVaultName={summerVaultName}
        timeframe={timeframe}
        colors={colors}
        data={parsedDataWithCutoff}
        dataNames={dataNames}
      />
    </Card>
  )
}
