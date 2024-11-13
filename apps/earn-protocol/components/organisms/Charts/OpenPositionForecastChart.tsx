import { Card } from '@summerfi/app-earn-ui'
import { type CardVariant } from '@summerfi/app-earn-ui/dist/types/src/components/atoms/Card/Card'
import { type ForecastDataPoints, type TimeframesType } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { ForecastChart } from '@/components/organisms/Charts/components/Forecast'

export const OpenPositionForecastChart = ({
  timeframe,
  setTimeframe,
  cardVariant = 'cardSecondary',
  parsedData,
  isLoadingForecast,
  tokenPrice,
}: {
  timeframe: TimeframesType
  setTimeframe: (timeframe: TimeframesType) => void
  cardVariant?: CardVariant
  parsedData: ForecastDataPoints
  isLoadingForecast?: boolean
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
        title="Open Position Forecast"
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <ForecastChart tokenPrice={tokenPrice} isLoading={isLoadingForecast} data={parsedData} />
    </Card>
  )
}
