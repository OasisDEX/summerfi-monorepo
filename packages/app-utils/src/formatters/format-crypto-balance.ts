import BigNumber from 'bignumber.js'

import { formatAsShorthandNumbers } from '@/formatters/format-as-shorthand-numbers'
import { formatToBigNumber } from '@/formatters/format-to-big-number'
import { hundredThousand, oneThousandth, ten, zero } from '@/numbers'

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

  if (absAmount.eq(zero)) {
    return `${prefix ?? ''}${formatAsShorthandNumbers(resolvedAmount, { precision: 2 })}`
  }

  if (absAmount.lt(oneThousandth)) {
    return `${prefix ?? ''}${resolvedAmount.isNegative() ? '0.000' : '<0.001'}`
  }

  if (absAmount.lt(ten)) {
    return `${prefix ?? ''}${formatAsShorthandNumbers(resolvedAmount, { precision: 4 })}`
  }

  if (absAmount.lt(hundredThousand)) {
    return `${prefix ?? ''}${resolvedAmount.toFormat(2, BigNumber.ROUND_DOWN)}`
  }

  return `${prefix ?? ''}${formatAsShorthandNumbers(resolvedAmount, { precision: 2 })}`
}
