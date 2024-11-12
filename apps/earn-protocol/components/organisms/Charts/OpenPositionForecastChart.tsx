import { Card } from '@summerfi/app-earn-ui'
import { type CardVariant } from '@summerfi/app-earn-ui/dist/types/src/components/atoms/Card/Card'
import { type ForecastDataPoint, type TimeframesType } from '@summerfi/app-types'

import { ChartHeader } from '@/components/organisms/Charts/ChartHeader'
import { ForecastChart } from '@/components/organisms/Charts/DumbCharts/Forecast'

export const OpenPositionForecastChart = ({
  timeframe,
  setTimeframe,
  cardVariant = 'cardSecondary',
  parsedData,
  isLoadingForecast,
}: {
  timeframe: TimeframesType
  setTimeframe: (timeframe: TimeframesType) => void
  cardVariant?: CardVariant
  parsedData: ForecastDataPoint
  isLoadingForecast?: boolean
}) => {
  return (
    <Card
      variant={cardVariant}
      style={{ marginTop: 'var(--spacing-space-medium)', flexDirection: 'column' }}
    >
      <ChartHeader
        title="Open Position Forecast"
        timeframe={timeframe}
        setTimeframe={(nextTimeFrame) => setTimeframe(nextTimeFrame as TimeframesType)}
      />
      <ForecastChart isLoading={isLoadingForecast} data={parsedData} />
    </Card>
  )
}
