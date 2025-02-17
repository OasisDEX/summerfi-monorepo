import { chartTimestampFormat } from '@summerfi/app-earn-ui'
import { formatAsShorthandNumbers, formatCryptoBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

const PERCENTAGE_SHORTHAND_THRESHOLD = 1000

export const formatChartCryptoValue = (amount: number) => {
  if (Number.isNaN(amount) || amount < 0) {
    return '0'
  }

  const unformattedValue = formatCryptoBalance(amount)

  if (unformattedValue.includes('.')) {
    // remove unnecessary trailing zeros
    return unformattedValue.replace(/\.?0+$/u, '')
  }

  return unformattedValue
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
