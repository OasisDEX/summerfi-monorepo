import BigNumber from 'bignumber.js'

import { formatAsShorthandNumbers } from '@/formatters/format-as-shorthand-numbers'
import { formatToBigNumber } from '@/formatters/format-to-big-number'
import { hundredThousand, million, oneThousandth, ten, zero } from '@/numbers'

/**
 * Formats a cryptocurrency balance as a human-readable string.
 *
 * This function converts a `BigNumber` or `string` or `number` or `bigint` representing a cryptocurrency balance into a string with appropriate precision, based on the balance's value:
 * - For balances less than 0.001, returns "<0.001" or "0.000" if the amount is negative.
 * - For balances less than 10, returns the amount with up to 4 decimal places.
 * - For balances less than a million, returns the amount with 2 decimal places.
 * - For larger balances, returns the amount in a shorthand format with appropriate units (K, M, B).
 *
 * @param amount - The `BigNumber` representing the cryptocurrency balance.
 * @param prefix - Optional prefix to add to the formatted balance.
 * @returns The formatted balance string.
 */
export const formatCryptoBalance = (
  amount: BigNumber | string | number | bigint,
  prefix?: string,
): string => {
  if (isNaN(Number(amount))) {
    return '-'
  }

  const resolvedAmount = formatToBigNumber(amount.toString())
  const absAmount = resolvedAmount.abs()
  let formattedAmount: string

  if (absAmount.eq(zero)) {
    formattedAmount = formatAsShorthandNumbers(resolvedAmount, { precision: 2 })
  } else if (absAmount.lt(oneThousandth)) {
    formattedAmount = resolvedAmount.isNegative() ? '0.000' : '<0.001'
  } else if (absAmount.lt(ten)) {
    formattedAmount = formatAsShorthandNumbers(resolvedAmount, { precision: 4 })
  } else if (absAmount.lt(hundredThousand)) {
    formattedAmount = formatAsShorthandNumbers(resolvedAmount, { precision: 2 })
  } else if (absAmount.lt(million)) {
    formattedAmount = resolvedAmount.toFormat(2, BigNumber.ROUND_DOWN)
  } else {
    formattedAmount = formatAsShorthandNumbers(resolvedAmount, { precision: 2 })
  }

  return `${prefix ?? ''}${formattedAmount}`
}
