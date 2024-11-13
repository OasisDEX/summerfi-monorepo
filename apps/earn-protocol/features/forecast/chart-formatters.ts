import { formatAsShorthandNumbers, formatCryptoBalance } from '@summerfi/app-utils'
import dayjs from 'dayjs'

export const chartTimestampFormat = 'YYYY-MM-DD' // Forecast API returns timestamps in this format

const SHORTHAND_THRESHOLD = 10000

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

export const formatChartDate = (date: typeof chartTimestampFormat) => {
  const parsedDate = dayjs(date, chartTimestampFormat)

  return parsedDate.isSame(dayjs(), 'day') ? 'Today' : parsedDate.format('MMM ‘YY')
}
