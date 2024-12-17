/* eslint-disable camelcase */
import {
  type ForecastData,
  type ForecastDataPoints,
  type PositionForecastAPIResponse,
} from '@summerfi/app-types'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

const parseForecastData = (
  timestamps: string[],
  timeframeData: PositionForecastAPIResponse['forecast']['daily'],
) => {
  return timestamps.map((timestamp, timestampIndex) => ({
    timestamp,
    forecast: timeframeData.forecast[timestampIndex],
    bounds: [
      timeframeData.lower_bound[timestampIndex],
      timeframeData.upper_bound[timestampIndex],
    ] as [number, number],
  }))
}

/**
 * Parses forecast data points from the API response.
 *
 * @param {PositionForecastAPIResponse} forecastData - The forecast data from the API.
 * @returns {ForecastData} The parsed forecast data points.
 */
export const parseForecastDatapoints: (
  forecastData: PositionForecastAPIResponse,
) => ForecastData = (forecastData: PositionForecastAPIResponse): ForecastData => {
  const hourly: ForecastDataPoints = parseForecastData(
    forecastData.forecast.hourly.timestamps,
    forecastData.forecast.hourly,
  )
  const daily: ForecastDataPoints = parseForecastData(
    forecastData.forecast.daily.timestamps,
    forecastData.forecast.daily,
  )
  const weekly: ForecastDataPoints = parseForecastData(
    forecastData.forecast.weekly.timestamps,
    forecastData.forecast.weekly,
  )

  return {
    generatedAt: forecastData.metadata.forecast_generated_at,
    amount: forecastData.metadata.initial_position_size,
    dataPoints: {
      hourly,
      daily,
      weekly,
    },
  }
}
