import BigNumber from 'bignumber.js'

import { formatPercent } from '@/formatters/format-percent'
import { formatToBigNumber } from '@/formatters/format-to-big-number'

/**
 * Converts a decimal `BigNumber` to a percentage string.
 *
 * This function multiplies the provided `BigNumber` by 100 to convert it into a percentage and then formats it as a string using the `formatPercent` function.
 * It supports customizing the precision, adding a plus sign for positive percentages, specifying a rounding mode, and optionally omitting the percent sign.
 *
 * @param amount - The `BigNumber` or `string` or `number` or `bigint` representing the decimal value to convert.
 * @param precision - The number of decimal places to include in the percentage (default is 2).
 * @param plus - Whether to include a plus sign for positive percentages (default is `false`).
 * @param roundMode - The rounding mode to use (default is `BigNumber.ROUND_DOWN`).
 * @param noPercentSign - Whether to omit the percent sign (default is `false`).
 * @param maxThreshold - Maximum threshold, if amount will be above it will fall back to this threshold (default is `1000`).
 * @returns The formatted percentage string.
 */
export const formatDecimalAsPercent = (
  amount: BigNumber | string | number | bigint,
  {
    precision = 2,
    plus = false,
    roundMode = BigNumber.ROUND_DOWN,
    noPercentSign = false,
    maxThreshold,
  }: {
    precision?: number
    plus?: boolean
    roundMode?: BigNumber.RoundingMode
    noPercentSign?: boolean
    maxThreshold?: string
  } = {},
): string => {
  const formatedAmount = formatToBigNumber(amount)

  if (maxThreshold && formatedAmount.times(100).isGreaterThan(maxThreshold)) {
    return `>${maxThreshold}%`
  }

  return formatPercent(formatedAmount.times(100), {
    precision,
    plus,
    roundMode,
    noPercentSign,
  })
}
