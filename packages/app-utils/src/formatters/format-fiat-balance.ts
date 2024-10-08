import BigNumber from 'bignumber.js'

import { formatAsShorthandNumbers } from '@/formatters/format-as-shorthand-numbers'
import { million, one, zero } from '@/numbers'

/**
 * Formats a fiat balance (BigNumber) into a readable string with appropriate precision.
 *
 * This function takes a `BigNumber` representing a fiat balance and formats it based on its value.
 * It uses shorthand notation for large numbers (e.g., millions) and adjusts precision for smaller values.
 *
 * @param amount - The fiat balance as a `BigNumber` to format.
 * @returns A formatted string representation of the balance with appropriate precision:
 * - Returns shorthand notation for values above a million.
 * - Displays two decimal places for values between 1 and 999,999.
 * - Displays up to four decimal places for values less than 1.
 * - Returns zero balance if the amount is zero.
 *
 * @example
 * // Formatting large values
 * formatFiatBalance(new BigNumber('2000000')) // "2.00M"
 *
 * @example
 * // Formatting values less than 1
 * formatFiatBalance(new BigNumber('0.0005')) // "0.0005"
 */
export const formatFiatBalance = (amount: BigNumber): string => {
  const absAmount = amount.absoluteValue()

  if (absAmount.eq(zero)) return formatAsShorthandNumbers(amount, { precision: 2 })
  if (absAmount.lt(one)) return formatAsShorthandNumbers(amount, { precision: 4 })
  if (absAmount.lt(million)) return amount.toFormat(2, BigNumber.ROUND_DOWN)
  // We don't want to have numbers like 999999 formatted as 999.99k

  return formatAsShorthandNumbers(amount, { precision: 2 })
}
