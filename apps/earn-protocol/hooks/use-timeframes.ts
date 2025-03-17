import { useMemo, useState } from 'react'
import {
  type ChartsDataTimeframes,
  type TimeframesItem,
  type TimeframesType,
} from '@summerfi/app-types'

import { POINTS_REQUIRED_FOR_CHART } from '@/constants/charts'

export const allTimeframesAvailable = {
  '7d': true,
  '30d': true,
  '90d': true,
  '6m': true,
  '1y': true,
  '3y': true,
}

export const allTimeframesNotAvailable = {
  '7d': false,
  '30d': false,
  '90d': false,
  '6m': false,
  '1y': false,
  '3y': false,
}

type UseTimeframesProps = {
  chartData?: ChartsDataTimeframes
  customDefaultTimeframe?: TimeframesType
}

export const useTimeframes = ({ chartData, customDefaultTimeframe }: UseTimeframesProps) => {
  const timeframes = useMemo(() => {
    if (!chartData) {
      return {} as TimeframesItem
    }

    return Object.keys(chartData).reduce<TimeframesItem>((acc, key) => {
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
          chartData[keyTyped].filter((dataPoint) => {
            // we dont want to include forecast data
            return !dataPoint.forecast
          }).length > POINTS_REQUIRED_FOR_CHART[keyTyped],
      }
    }, allTimeframesNotAvailable)
  }, [chartData])

  // if 90d isnt available, default to 7d
  const [timeframe, setTimeframe] = useState<TimeframesType>(
    customDefaultTimeframe ? customDefaultTimeframe : timeframes['90d'] ? '90d' : '7d',
  )

  return {
    timeframes,
    timeframe,
    setTimeframe,
  }
}
