import { Card, type CardVariant } from '@summerfi/app-earn-ui'
import { type ForecastDataPoints, type TimeframesType } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { ForecastChart } from '@/components/organisms/Charts/components/Forecast'

export const OpenPositionForecastChart = ({
  timeframe,
  setTimeframe,
  cardVariant = 'cardSecondary',
  parsedData,
  isManage,
  isLoadingForecast,
  tokenPrice,
}: {
  timeframe: TimeframesType
  setTimeframe: (timeframe: TimeframesType) => void
  cardVariant?: CardVariant
  parsedData: ForecastDataPoints
  isLoadingForecast?: boolean
  isManage?: boolean
  tokenPrice?: string | null
}) => {
  return (
    <Card
      variant={cardVariant}
      style={{
        marginTop: 'var(--spacing-space-medium)',
        flexDirection: 'column',
        paddingBottom: 0,
      }}
    >
      <ChartHeader
        timeframes={{
          '7d': true,
          '30d': true,
          '90d': true,
          '6m': true,
          '1y': true,
          '3y': true,
        }}
        title={isManage ? 'Updated Position Forecast' : 'Open Position Forecast'}
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <ForecastChart tokenPrice={tokenPrice} isLoading={isLoadingForecast} data={parsedData} />
    </Card>
  )
}
