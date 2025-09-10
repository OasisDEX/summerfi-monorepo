import { BigNumber } from 'bignumber.js'

import { zero } from '@/numbers'

import { formatToBigNumber } from './format-to-big-number'

/**
 * Formats a number using BigNumber's toFormat method with specified precision and rounding mode.
 * @param amount - The number to format (can be BigNumber, string, number, or bigint)
 * @param options - Formatting options
 * @param options.precision - Number of decimal places to show (default: 0)
 * @param options.roundMode - Rounding mode to use (default: ROUND_DOWN)
 * @param options.cutOffNegative - Whether to cut off negative numbers (default: true)
 * @returns Formatted string with thousands and decimal separators
 */
export const formatWithSeparators = (
  amount: BigNumber | string | number | bigint,
  {
    precision = 0,
    roundMode = BigNumber.ROUND_DOWN,
    cutOffNegative = true,
  }: { precision?: number; roundMode?: BigNumber.RoundingMode; cutOffNegative?: boolean } = {},
): string => {
  const resolvedAmount = formatToBigNumber(amount)

  if (cutOffNegative && resolvedAmount.lt(new BigNumber('0.01')) && !resolvedAmount.eq(zero))
    return '<0.01'

  return resolvedAmount.toFormat(precision, roundMode)
}
