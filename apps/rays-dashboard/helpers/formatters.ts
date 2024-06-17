/* eslint-disable no-magic-numbers */

import BigNumber from 'bignumber.js'

export const minusOne = new BigNumber('-1')
export const oneThousandth = new BigNumber('0.0001')
export const zero = new BigNumber('0')
export const one = new BigNumber('1')
export const ten = new BigNumber('10')
export const hundred = new BigNumber('100')
export const thousand = new BigNumber('1000')
export const million = new BigNumber('1000000')
export const billion = new BigNumber('1000000000')

// text formatters
export function formatAddress(address: string, first: number = 4, last: number = 5) {
  return `${address.slice(0, first)}...${address.slice(-last)}`
}

// number formatters

export function toShorthandNumber(amount: BigNumber, suffix: string = '', precision?: number) {
  const sh = new BigNumber(
    amount
      .toString()
      .split('.')
      .map((part, index) => {
        if (index === 0) return part

        return part.substring(0, precision)
      })
      .filter((el) => el)
      .join('.'),
  )

  if (precision) {
    return sh.toFixed(precision).concat(suffix)
  }

  return sh.toFixed().concat(suffix)
}

export function formatAsShorthandNumbers(amount: BigNumber, precision?: number): string {
  if (amount.absoluteValue().gte(billion)) {
    return toShorthandNumber(amount.dividedBy(billion), 'B', precision)
  }
  if (amount.absoluteValue().gte(million)) {
    return toShorthandNumber(amount.dividedBy(million), 'M', precision)
  }
  if (amount.absoluteValue().gte(thousand)) {
    return toShorthandNumber(amount.dividedBy(thousand), 'K', precision)
  }

  return toShorthandNumber(amount, '', precision)
}

export function formatCryptoBalance(amount: BigNumber): string {
  const absAmount = amount.absoluteValue()

  if (absAmount.eq(zero)) {
    return formatAsShorthandNumbers(amount, 2)
  }

  if (absAmount.lt(oneThousandth)) {
    return `${amount.isNegative() ? '0.000' : '<0.001'}`
  }

  if (absAmount.lt(ten)) {
    return formatAsShorthandNumbers(amount, 4)
  }

  if (absAmount.lt(million)) return amount.toFormat(2, BigNumber.ROUND_DOWN)

  return formatAsShorthandNumbers(amount, 2)
}
