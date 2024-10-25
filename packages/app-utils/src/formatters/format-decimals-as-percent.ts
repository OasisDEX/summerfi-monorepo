import BigNumber from 'bignumber.js'

import { formatPercent } from '@/formatters/format-percent'
import { formatToBigNumber } from '@/formatters/format-to-big-number'

/**
 * Converts a decimal `BigNumber` to a percentage string.
 *
 * This function multiplies the provided `BigNumber` by 100 to convert it into a percentage and then formats it as a string using the `formatPercent` function.
 * It supports customizing the precision, adding a plus sign for positive percentages, specifying a rounding mode, and optionally omitting the percent sign.
 *
 * @param amount - The `BigNumber` representing the decimal value to convert.
 * @param precision - The number of decimal places to include in the percentage (default is 2).
 * @param plus - Whether to include a plus sign for positive percentages (default is `false`).
 * @param roundMode - The rounding mode to use (default is `BigNumber.ROUND_DOWN`).
 * @param noPercentSign - Whether to omit the percent sign (default is `false`).
 * @returns The formatted percentage string.
 */
export const formatDecimalAsPercent = (
  amount: BigNumber | string | number,
  {
    precision = 2,
    plus = false,
    roundMode = BigNumber.ROUND_DOWN,
    noPercentSign = false,
  }: {
    precision?: number
    plus?: boolean
    roundMode?: BigNumber.RoundingMode
    noPercentSign?: boolean
  } = {},
) => {
  const resolvedAmount = formatToBigNumber(amount)

  return formatPercent(resolvedAmount.times(100), {
    precision,
    plus,
    roundMode,
    noPercentSign,
  })
}
