import type BigNumber from 'bignumber.js'

import { formatShorthandNumber } from '@/formatters/format-shorthand-number'
import { billion, million, thousand } from '@/numbers'

/**
 * Formats a `BigNumber` as a shorthand string representation based on its value.
 *
 * This function converts large numbers into more readable shorthand formats:
 * - `B` for billions
 * - `M` for millions
 * - `K` for thousands
 *
 * It automatically adjusts the number by dividing it with the appropriate unit (billion, million, or a thousand) and appends the corresponding suffix.
 * If the number is less than a thousand, it returns the number as is, with any specified suffix.
 *
 * @param amount - The `BigNumber` to be formatted.
 * @param suffix - An optional string to append to the result. Defaults to an empty string.
 * @param precision - The number of decimal places to retain in the fractional part of the number. If not provided, the full precision is kept.
 * @returns The shorthand string representation of the number.
 */
export const formatAsShorthandNumbers = (
  amount: BigNumber,
  {
    suffix = '',
    precision,
  }: {
    suffix?: string
    precision?: number
  } = {},
): string => {
  if (amount.absoluteValue().gte(billion)) {
    return formatShorthandNumber(amount.dividedBy(billion), { suffix: 'B', precision })
  }
  if (amount.absoluteValue().gte(million)) {
    return formatShorthandNumber(amount.dividedBy(million), { suffix: 'M', precision })
  }
  if (amount.absoluteValue().gte(thousand)) {
    return formatShorthandNumber(amount.dividedBy(thousand), { suffix: 'K', precision })
  }

  return formatShorthandNumber(amount, { suffix, precision })
}
