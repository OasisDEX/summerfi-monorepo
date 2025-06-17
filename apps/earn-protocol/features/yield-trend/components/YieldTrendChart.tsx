import { useMemo } from 'react'
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

export const YieldTrendChart = ({
  chartData,
  summerVaultName,
  filters,
}: {
  summerVaultName: string
  chartData: ArksHistoricalChartData
  filters: InlineButtonOption<string>[]
}) => {
  const {
    timeframe,
    setTimeframe,
    timeframes,
    isZoomed,
    zoomedData,
    handleResetZoom,
    isSelectingZoom,
    selectionZoomStart,
    selectionZoomEnd,
    createSelectionHandlers,
  } = useTimeframes({
    chartData: chartData.data,
  })

  const filteredArks = useMemo(() => {
    if (filters[0].key === 'all') {
      return undefined
    }

    return filters.map((filter) => filter.key).filter((key) => key !== 'all')
  }, [filters])

  const colors = {
    [`${summerVaultName}`]: '#FF49A4',
    ...chartData.colors,
  }

  const dataNames = useMemo(() => {
    return [summerVaultName, ...chartData.dataNames]
  }, [chartData.dataNames, summerVaultName])

  const parsedData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!chartData) {
      return []
    }

    return chartData.data[timeframe]
  }, [chartData, timeframe])

  const dataToDisplay = isZoomed ? (zoomedData as typeof parsedData) : parsedData

  const parsedDataWithCutoff =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !chartData || chartData.data['7d'].length <= POINTS_REQUIRED_FOR_CHART['7d']
      ? []
      : dataToDisplay

  return (
    <>
      {!parsedDataWithCutoff.length && <NotEnoughData />}
      <ChartHeader
        timeframes={timeframes}
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
        isZoomed={isZoomed}
        onResetZoom={handleResetZoom}
        title="Historical DeFi Yield"
      />
      <YieldsChart
        summerVaultName={summerVaultName}
        timeframe={timeframe}
        colors={colors}
        data={parsedDataWithCutoff}
        dataNames={dataNames}
        filteredDataList={filteredArks}
        isSelectingZoom={isSelectingZoom}
        selectionZoomStart={selectionZoomStart}
        selectionZoomEnd={selectionZoomEnd}
        selectionHandlers={createSelectionHandlers(parsedData)}
      />
    </>
  )
}
