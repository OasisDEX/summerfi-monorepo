'use client'

import { useMemo, useState } from 'react'
import { Card } from '@summerfi/app-earn-ui'
import { type TimeframesType, type VaultChartsHistoricalData } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { YieldsChart } from '@/components/organisms/Charts/components/Yields'

type HistoricalYieldChartProps = {
  chartData: VaultChartsHistoricalData['chartsData']
  summerVaultName: string
}

const getTimeframesBasedOnDataAvailable = (chartData: VaultChartsHistoricalData['chartsData']) => {
  const baseList: TimeframesType[] = ['7d'] // we introduce a 7d one... which is hourly,  no thresholds

  if (!chartData) {
    return baseList
  }

  if (chartData.data['7d'].length > 168) {
    // then if > 168 hourly points, a 30d one, again hourly (so it shows 7d and 30d only)
    baseList.push('30d')
  }
  if (chartData.data['90d'].length > 90) {
    // If > 90 daily points -> show 30d (hourly), 90d daily, 1y (daily)
    baseList.push('90d')
  }
  if (chartData.data['90d'].length > 365) {
    // if > 365 daily point -> show 30d (hourly), 90d daily, 1y (daily), 3 year (weeks)
    baseList.push('6m')
    baseList.push('1y')
    baseList.push('3y')
  }

  return baseList
}

export const HistoricalYieldChart = ({ chartData, summerVaultName }: HistoricalYieldChartProps) => {
  const timeframesList = getTimeframesBasedOnDataAvailable(chartData)
  const [timeframe, setTimeframe] = useState<TimeframesType>(timeframesList[0])
  const [compare, setCompare] = useState(true)

  const colors = {
    [`${summerVaultName}`]: '#FF49A4',
    ...chartData?.colors,
  }

  const dataNames = [summerVaultName, ...(chartData?.dataNames ?? [])]

  const parsedData = useMemo(() => {
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

  return (
    <Card
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        paddingBottom: 0,
      }}
    >
      <ChartHeader
        compare={compare}
        setCompare={(nextCompare) => setCompare(nextCompare)}
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
        customTimeframes={timeframesList}
      />
      <YieldsChart
        summerVaultName={summerVaultName}
        timeframe={timeframe}
        colors={colors}
        data={parsedData}
        dataNames={dataNames}
      />
    </Card>
  )
}
