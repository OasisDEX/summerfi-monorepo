import { useMemo, useState } from 'react'
import {
  type ChartsDataTimeframes,
  type TimeframesItem,
  type TimeframesType,
} from '@summerfi/app-types'

import { POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'

export const useTimeframes = ({
  chartData,
}: {
  chartData?: {
    data: ChartsDataTimeframes
  }
}) => {
  const timeframes = useMemo(() => {
    if (!chartData) {
      return {} as TimeframesItem
    }

    return Object.keys(chartData.data).reduce<TimeframesItem>(
      (acc, key) => {
        const keyTyped = key as keyof ChartsDataTimeframes

        if (keyTyped === '7d') {
          // we always want to show 7d
          return {
            ...acc,
            [keyTyped]: true,
          }
        }

        return {
          ...acc,
          [keyTyped]:
            chartData.data[keyTyped].filter((dataPoint) => {
              // we dont want to include forecast data
              return !dataPoint.forecast
            }).length > POINTS_REQUIRED_FOR_CHART[keyTyped],
        }
      },
      {
        '7d': false,
        '30d': false,
        '90d': false,
        '6m': false,
        '1y': false,
        '3y': false,
      },
    )
  }, [chartData])

  // if 90d isnt available, default to 7d
  const [timeframe, setTimeframe] = useState<TimeframesType>(timeframes['90d'] ? '90d' : '7d')

  return {
    timeframes,
    timeframe,
    setTimeframe,
  }
}
