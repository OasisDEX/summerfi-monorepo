/* eslint-disable camelcase */
import {
  type ForecastData,
  type ForecastDataPoint,
  type PositionForecastAPIResponse,
} from '@summerfi/app-types'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import { chartTimestampFormat } from '@/features/forecast/chart-formatters'

dayjs.extend(weekOfYear)

export const parseForecastDatapoints: (
  forecastData: PositionForecastAPIResponse,
) => ForecastData = (forecastData: PositionForecastAPIResponse) => {
  const seriesKeyed = forecastData.forecast.series.reduce<{
    [key in PositionForecastAPIResponse['forecast']['series'][number]['name']]: number[]
  }>(
    (acc, series) => {
      acc[series.name] = series.data

      return acc
    },
    { forecast: [], upper_bound: [], lower_bound: [] },
  )

  const daily: ForecastDataPoint = [
    // we need to add the first point manually
    {
      timestamp: forecastData.forecast.timestamps[0],
      forecast: Number(seriesKeyed.forecast[0]),
      bounds: [Number(seriesKeyed.lower_bound[0]), Number(seriesKeyed.upper_bound[0])],
    },
  ]
  const weekly: ForecastDataPoint = [
    {
      timestamp: forecastData.forecast.timestamps[0],
      forecast: Number(seriesKeyed.forecast[0]),
      bounds: [Number(seriesKeyed.lower_bound[0]), Number(seriesKeyed.upper_bound[0])],
    },
  ]
  const monthly: ForecastDataPoint = [
    {
      timestamp: forecastData.forecast.timestamps[0],
      forecast: Number(seriesKeyed.forecast[0]),
      bounds: [Number(seriesKeyed.lower_bound[0]), Number(seriesKeyed.upper_bound[0])],
    },
  ]

  // originally that was reduced separately for each series, but it was pretty slow (300ms+ for 3y worth of points)
  // this runs the same data through at once, and is much faster (10-50ms for 3y worth of points) + its cached

  const addedWeeklyPointsMap = new Map<string, boolean>()
  const addedMonthlyPointsMap = new Map<string, boolean>()

  forecastData.forecast.timestamps.forEach((timestamp, timestampIndex) => {
    if (timestampIndex === 0) {
      // first result is handled above
      return
    }
    const weekDate = dayjs(timestamp).endOf('week').format(chartTimestampFormat)
    const monthDate = dayjs(timestamp).endOf('month').format(chartTimestampFormat)

    const pointData = {
      // for BandedChart (used in forecast) we need to have a main value
      // "forecast" is the main value, "bounds" are the lower and upper bounds (an array of values)
      forecast: Number(seriesKeyed.forecast[timestampIndex]),
      bounds: [
        Number(seriesKeyed.lower_bound[timestampIndex]),
        Number(seriesKeyed.upper_bound[timestampIndex]),
      ] as [number, number],
    }

    daily.push({
      timestamp,
      ...pointData,
    })

    if (!addedWeeklyPointsMap.has(weekDate)) {
      addedWeeklyPointsMap.set(weekDate, true)
      weekly.push({
        timestamp: weekDate,
        ...pointData,
      })
    }
    if (!addedMonthlyPointsMap.has(monthDate)) {
      addedMonthlyPointsMap.set(monthDate, true)
      monthly.push({
        timestamp: monthDate,
        ...pointData,
      })
    }
  })

  return {
    generatedAt: forecastData.metadata.forecast_generated_at,
    amount: forecastData.metadata.initial_position_size,
    dataPoints: {
      daily,
      weekly,
      monthly,
    },
  }
}
