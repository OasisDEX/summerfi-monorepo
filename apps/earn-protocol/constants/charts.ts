import { type TimeframesType } from '@summerfi/app-types'

export const CHART_TIMESTAMP_FORMAT_DETAILED = 'YYYY-MM-DD HH:mm:ss' // used for hourly data
export const CHART_TIMESTAMP_FORMAT_SHORT = 'DD MMM YYYY' // used for daily and weekly data
export const POINTS_REQUIRED_FOR_CHART: {
  [key in TimeframesType]: number
} = {
  // show 7d hourly data after one hour
  '7d': 1, // hourly
  // show 30d hourly data after more than 7d (in hours) is available
  '30d': 168, // hourly
  // show 90d daily data after more than 30d (in days) is available
  '90d': 30, // daily
  // show 6m daily data after more than 90d (in days) is available
  '6m': 90, // daily
  // show 1y daily data after more than 6m (in days) is available
  '1y': 180, // daily
  // show 3y weekly data after more than 1y (in weeks) is available
  '3y': 52, // weekly
}
