'use client'

import { useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type ArksHistoricalChartData, type TimeframesType } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { NotEnoughData } from '@/components/organisms/Charts/components/NotEnoughData'
import { YieldsChart } from '@/components/organisms/Charts/components/Yields'
import { POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'
import { useTimeframes } from '@/hooks/use-timeframes'

type ArkHistoricalYieldChartProps = {
  chartData: ArksHistoricalChartData
  summerVaultName: string
}

export const ArkHistoricalYieldChart = ({
  chartData,
  summerVaultName,
}: ArkHistoricalYieldChartProps) => {
  const { timeframe, setTimeframe, timeframes } = useTimeframes({
    chartData: chartData.data,
  })
  const [compare, setCompare] = useState(false)

  const colors = {
    [`${summerVaultName}`]: '#FF49A4',
    ...chartData.colors,
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const dataNames = [summerVaultName, ...(compare ? chartData.dataNames ?? [] : [])]

  const parsedData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData) {
      return []
    }

    if (!compare) {
      return chartData.data[timeframe].map((point) => ({
        timestamp: point.timestamp,
        [summerVaultName]: point[summerVaultName],
      }))
    }

    return chartData.data[timeframe]
  }, [timeframe, chartData, compare, summerVaultName])

  const parsedDataWithCutoff =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !chartData || chartData.data['7d'].length <= POINTS_REQUIRED_FOR_CHART['7d'] ? [] : parsedData

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        paddingBottom: 0,
        position: 'relative',
      }}
    >
      {!parsedDataWithCutoff.length && <NotEnoughData />}
      <ChartHeader
        timeframes={timeframes}
        checkboxValue={compare}
        setCheckboxValue={(nextCompare) => setCompare(nextCompare)}
        checkboxLabel="Compare to others"
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
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
