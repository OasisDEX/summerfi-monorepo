import { chartTimestampFormat } from '@summerfi/app-earn-ui'
import { formatAsShorthandNumbers } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

const PERCENTAGE_SHORTHAND_THRESHOLD = 1000

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
