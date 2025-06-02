import { BigNumber } from 'bignumber.js'

import { formatToBigNumber } from './format-to-big-number'

/**
 * Formats a number using BigNumber's toFormat method with specified precision and rounding mode.
 * @param amount - The number to format (can be BigNumber, string, number, or bigint)
 * @param options - Formatting options
 * @param options.precision - Number of decimal places to show (default: 0)
 * @param options.roundMode - Rounding mode to use (default: ROUND_DOWN)
 * @returns Formatted string with thousands and decimal separators
 */
export const formatWithSeparators = (
  amount: BigNumber | string | number | bigint,
  {
    precision = 0,
    roundMode = BigNumber.ROUND_DOWN,
  }: { precision?: number; roundMode?: BigNumber.RoundingMode } = {},
): string => {
  const resolvedAmount = formatToBigNumber(amount)

  return resolvedAmount.toFormat(precision, roundMode)
}
