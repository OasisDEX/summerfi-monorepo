import type BigNumber from 'bignumber.js'

import { formatToBigNumber } from '@/formatters/format-to-big-number'

import { formatAsShorthandNumbers } from './format-as-shorthand-numbers'

/**
 * Formats a `BigNumber` as a percentage string.
 *
 * This function converts a `BigNumber` to a percentage string with the specified precision and formatting options:
 * - Includes a plus sign (+) for positive percentages if `plus` is set to `true`.
 * - Allows customization of rounding mode via `roundMode`.
 * - Optionally omits the percent sign (%) if `noPercentSign` is set to `true`.
 *
 * @param amount - The `BigNumber` or `string` or `number` or `bigint` representing the percentage amount.
 * @param precision - The number of decimal places to include (default is 0).
 * @param plus - Whether to include a plus sign for positive percentages (default is `false`).
 * @param roundMode - The rounding mode to use (optional).
 * @param noPercentSign - Whether to omit the percent sign (default is `false`).
 * @returns The formatted percentage string.
 */
export const formatPercent = (
  amount: BigNumber | string | number | bigint,
  {
    precision = 0,
    plus = false,
    roundMode,
    noPercentSign = false,
  }: {
    precision?: number
    plus?: boolean
    roundMode?: BigNumber.RoundingMode
    noPercentSign?: boolean
  } = {},
) => {
  const resolvedAmount = formatToBigNumber(amount)

  const sign = plus && resolvedAmount.isGreaterThan(0) ? '+' : ''

  return `${sign}${formatAsShorthandNumbers(resolvedAmount.toFixed(precision, roundMode), { precision })}${noPercentSign ? '' : '%'}`
}
