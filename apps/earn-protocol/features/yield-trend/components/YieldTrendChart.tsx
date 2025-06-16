import { type TimeframesType } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { YieldsChart } from '@/components/organisms/Charts/components/Yields'
import { useTimeframes } from '@/hooks/use-timeframes'

export const YieldTrendChart = () => {
  const {
    timeframe,
    setTimeframe,
    timeframes,
    isZoomed,
    handleResetZoom,
    isSelectingZoom,
    selectionZoomStart,
    selectionZoomEnd,
    createSelectionHandlers,
  } = useTimeframes({
    chartData: {
      '7d': [], // hourly
      '30d': [], // hourly
      '90d': [], // daily
      '6m': [], // daily
      '1y': [], // daily
      '3y': [], // weekly
    },
  })

  return (
    <>
      <ChartHeader
        timeframes={timeframes}
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
        isZoomed={isZoomed}
        onResetZoom={handleResetZoom}
      />
      <YieldsChart
        summerVaultName="summerVaultName"
        timeframe={timeframe}
        colors={{
          summerVaultName: '#FF49A4',
        }}
        data={[]}
        dataNames={['summerVaultName']}
        isSelectingZoom={isSelectingZoom}
        selectionZoomStart={selectionZoomStart}
        selectionZoomEnd={selectionZoomEnd}
        selectionHandlers={createSelectionHandlers([])}
      />
    </>
  )
}
