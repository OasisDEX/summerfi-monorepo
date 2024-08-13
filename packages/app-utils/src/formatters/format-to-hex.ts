/**
 * Converts a given number or string value to a hexadecimal string with an optional prefix.
 *
 * This function takes a number or string representation of a number and converts it to its hexadecimal form.
 * The resulting hexadecimal string is optionally prefixed with a provided string (defaults to "0x").
 *
 * @param value - The number or string to convert to hexadecimal.
 * @param prefix - An optional prefix for the hexadecimal string (defaults to "0x").
 * @returns The hexadecimal string representation of the input value, with the specified prefix.
 */
export const formatToHex = (
  value: number | string,
  {
    prefix = '0x',
  }: {
    prefix?: string
  } = {},
) => {
  return `${prefix}${Number(value).toString(16)}`
}
