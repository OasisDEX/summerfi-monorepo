import { chartTimestampFormat } from '@summerfi/app-earn-ui'
import { formatAsShorthandNumbers } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

const PERCENTAGE_SHORTHAND_THRESHOLD = 1000

export const formatChartCryptoValue = (amount: number, detailed?: boolean) => {
  if (Number.isNaN(amount) || amount < 0) {
    return '0'
  }

  // Handle zero
  if (amount === 0) return '0'

  // Handle very small values with compact notation
  if (amount < 0.001 && amount > 0) {
    // For extremely small values, show as "<0.001"
    return '<0.001'
  }

  // Handle small values with minimal decimals
  if (amount < 0.01 && amount > 0) {
    return amount.toFixed(detailed ? 5 : 3)
  }

  // Handle values < 1 with 2 decimals
  if (amount < 1) {
    return amount.toFixed(detailed ? 4 : 2)
  }

  // Handle values 1-99 with 1 decimal
  if (amount < 100) {
    return amount.toFixed(detailed ? 3 : 1)
  }

  // Handle values 100-999 with no decimals
  if (amount < 1000) {
    return detailed ? amount.toFixed(2) : Math.round(amount).toString()
  }

  // Handle values >= 1000 with K suffix
  if (amount < 1000000) {
    const kValue = amount / 1000

    if (kValue < 10) {
      return `${parseFloat(kValue.toFixed(detailed ? 3 : 1))}K`
    }

    return `${detailed ? parseFloat(kValue.toFixed(2)) : Math.round(kValue)}K`
  }

  // Handle values >= 1M with M suffix
  const mValue = amount / 1000000

  if (mValue < 10) {
    return `${parseFloat(mValue.toFixed(detailed ? 3 : 1))}M`
  }

  return `${detailed ? parseFloat(mValue.toFixed(2)) : Math.round(mValue)}M`
}

export const formatChartPercentageValue = (amount: number, detailed: boolean = false) => {
  if (Number.isNaN(amount) || amount <= 0) {
    return '0'
  }

  if (amount > PERCENTAGE_SHORTHAND_THRESHOLD) {
    return `${formatAsShorthandNumbers(amount, { precision: 3 })}%`
  }

  return `${new BigNumber(amount).toFixed(detailed ? 2 : 0)}%`
}

export const formatChartDate = (date: typeof chartTimestampFormat) => {
  const parsedDate = dayjs(date, chartTimestampFormat)

  if (!parsedDate.isValid()) {
    return 'Invalid Date'
  }

  // Use startOf('day') to ensure timezone-safe comparison
  return parsedDate.startOf('day').isSame(dayjs().startOf('day'))
    ? 'Today'
    : parsedDate.format('MMM ‘YY')
}
