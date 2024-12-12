import { type ForecastData } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

/**
 * Calculate the earnings for one year based on the provided forecast data and input value.
 *
 * @param {Object} params - The parameters for the function.
 * @param {ForecastData} [params.forecast] - The forecast data containing weekly data points.
 * @param {string} params.inputValue - The input value to be subtracted from the forecast.
 * @returns {string | undefined} - The calculated earnings for one year as a string, or undefined if no data is available.
 */
export const getOneYearEarnings = ({
  forecast,
  inputValue,
}: {
  forecast?: ForecastData
  inputValue: string
}): string | undefined => {
  if (inputValue === '0') {
    return inputValue
  }

  const preMapData = forecast?.dataPoints.weekly.filter((point) =>
    dayjs(point.timestamp).isBefore(dayjs().add(1, 'day').add(1, 'year')),
  )

  return preMapData
    ? new BigNumber(preMapData[preMapData.length - 1].forecast).minus(inputValue).toString()
    : undefined
}
