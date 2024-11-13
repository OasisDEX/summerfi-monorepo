import { formatAsShorthandNumbers, formatCryptoBalance } from '@summerfi/app-utils'
import dayjs from 'dayjs'

export const chartTimestampFormat = 'YYYY-MM-DD' // Forecast API returns timestamps in this format

export const formatChartCryptoValue = (amount: number) => {
  // for now
  if (amount > 10000) {
    return formatAsShorthandNumbers(amount)
  }

  return formatCryptoBalance(amount)
}

export const formatChartDate = (date: typeof chartTimestampFormat) => {
  const parsedDate = dayjs(date, chartTimestampFormat)

  return parsedDate.isSame(dayjs(), 'day') ? 'Today' : parsedDate.format('MMM ‘YY')
}
