import { type TimeframesType } from '@summerfi/app-types'

export const CHART_TIMESTAMP_FORMAT_DETAILED = 'YYYY-MM-DD HH:mm:ss' // used for hourly data
export const CHART_TIMESTAMP_FORMAT_SHORT = 'DD MMM YYYY' // used for daily and weekly data
export const POINTS_REQUIRED_FOR_CHART: {
  [key in TimeframesType]: number
} = {
  '7d': 12, // hourly
  '30d': 24, // hourly
  '90d': 14, // daily
  '6m': 30, // daily
  '1y': 60, // daily
  '3y': 360, // weekly
}
export const DAYS_TO_WAIT_FOR_CHART = 3
