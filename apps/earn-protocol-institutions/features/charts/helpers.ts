import { type TimeframesType } from '@summerfi/app-types'

export const formatChartCryptoValue = (amount: number) => {
  if (Number.isNaN(amount) || amount < 0) {
    return '0'
  }

  const one = 1
  const ten = 10
  const hundred = 100
  const thousand = 1000
  const tenThousand = 10000
  const hundredThousand = 100000
  const million = 1000000
  const billion = 1000000000

  if (amount === 0) return '0'

  if (amount < 0.001 && amount > 0) {
    return '<0.001'
  }

  if (amount < 0.01 && amount > 0) {
    return amount.toFixed(5)
  }

  if (amount < one) {
    return amount.toFixed(4)
  }

  if (amount < ten) {
    return amount.toFixed(4)
  }

  if (amount < hundred) {
    return amount.toFixed(3)
  }

  if (amount < thousand) {
    return amount.toFixed(2)
  }

  if (amount < tenThousand) {
    return amount.toFixed(2)
  }

  if (amount < hundredThousand) {
    const kValue = amount / thousand

    return `${parseFloat(kValue.toFixed(3))}K`
  }

  if (amount < million) {
    const kValue = amount / thousand

    if (kValue < 10) {
      return `${parseFloat(kValue.toFixed(3))}K`
    }

    return `${parseFloat(kValue.toFixed(2))}K`
  }

  if (amount < billion) {
    const mValue = amount / million

    if (mValue < 10) {
      return `${parseFloat(mValue.toFixed(3))}M`
    }

    return `${parseFloat(mValue.toFixed(2))}M`
  }
  const bValue = amount / billion

  if (bValue < 10) {
    return `${parseFloat(bValue.toFixed(3))}B`
  }

  return `${parseFloat(bValue.toFixed(2))}B`
}

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
