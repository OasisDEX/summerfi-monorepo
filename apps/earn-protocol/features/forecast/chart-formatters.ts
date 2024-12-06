import { formatAsShorthandNumbers, formatCryptoBalance } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

export const chartTimestampFormat = 'YYYY-MM-DD' // Forecast API returns timestamps in this format

const SHORTHAND_THRESHOLD = 10000
const PERCENTAGE_SHORTHAND_THRESHOLD = 1000

export const formatChartCryptoValue = (amount: number) => {
  if (Number.isNaN(amount) || amount < 0) {
    return '0'
  }

  // Use shorthand notation (e.g., 10.5K) for values above threshold
  if (amount > SHORTHAND_THRESHOLD) {
    return formatAsShorthandNumbers(amount)
  }

  return formatCryptoBalance(amount)
}

export const formatChartPercentageValue = (amount: number, detailed: boolean = false) => {
  if (Number.isNaN(amount) || amount <= 0) {
    return '0'
  }

  if (amount > PERCENTAGE_SHORTHAND_THRESHOLD) {
    return `${formatAsShorthandNumbers(amount)}%`
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
