import BigNumber from 'bignumber.js'

/**
 * Converts a `BigNumber` to a shorthand string representation with optional suffix and precision.
 *
 * This function truncates the fractional part of the `BigNumber` to the specified precision, and appends a suffix if provided.
 * The resulting number is returned as a string.
 *
 * @param amount - The `BigNumber` or `string` or `number` or `bigint` to be converted.
 * @param suffix - An optional string to append to the result. Defaults to an empty string.
 * @param precision - The number of decimal places to retain in the fractional part of the number. If not provided, the full precision is kept.
 * @returns The shorthand string representation of the number, with the specified precision and suffix.
 */
export const formatShorthandNumber = (
  amount: BigNumber | string | number | bigint,
  {
    suffix = '',
    precision,
  }: {
    suffix?: string
    precision?: number
  } = {},
): string => {
  const sh = new BigNumber(
    amount
      .toString()
      .split('.')
      .map((part, index) => {
        if (index === 0) return part

        return part.substring(0, precision)
      })
      .filter((el) => el)
      .join('.'),
  )

  if (precision) {
    return sh.toFixed(precision).concat(suffix)
  }

  return sh.toFixed().concat(suffix)
}
