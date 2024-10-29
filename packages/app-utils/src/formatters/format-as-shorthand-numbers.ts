import type BigNumber from 'bignumber.js'

import { formatShorthandNumber } from '@/formatters/format-shorthand-number'
import { formatToBigNumber } from '@/formatters/format-to-big-number'
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
 * @param amount - The `BigNumber` or `string` or `number` or `bigint` to be formatted.
 * @param suffix - An optional string to append to the result. Defaults to an empty string.
 * @param precision - The number of decimal places to retain in the fractional part of the number. If not provided, the full precision is kept.
 * @returns The shorthand string representation of the number.
 */
export const formatAsShorthandNumbers = (
  amount: BigNumber | string | number | bigint,
  {
    suffix = '',
    precision,
  }: {
    suffix?: string
    precision?: number
  } = {},
): string => {
  const resolvedAmount = formatToBigNumber(amount)

  if (resolvedAmount.absoluteValue().gte(billion)) {
    return formatShorthandNumber(resolvedAmount.dividedBy(billion), { suffix: 'B', precision })
  }
  if (resolvedAmount.absoluteValue().gte(million)) {
    return formatShorthandNumber(resolvedAmount.dividedBy(million), { suffix: 'M', precision })
  }
  if (resolvedAmount.absoluteValue().gte(thousand)) {
    return formatShorthandNumber(resolvedAmount.dividedBy(thousand), { suffix: 'K', precision })
  }

  return formatShorthandNumber(resolvedAmount, { suffix, precision })
}
