import { type TimeframesType } from '@summerfi/app-types'

export const CHART_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const POINTS_REQUIRED_FOR_CHART = {
  '7d': 12,
  '30d': 12,
  '90d': 6,
  '6m': 6,
  '1y': 6,
  '3y': 6,
} as {
  [key in TimeframesType]: number
}
export const DAYS_TO_WAIT_FOR_CHART = 3
