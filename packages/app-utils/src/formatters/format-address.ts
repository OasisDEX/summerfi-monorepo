/**
 * Formats a blockchain address by truncating it and inserting ellipsis in the middle.
 *
 * The function keeps the first and last characters of the address as specified by the `first` and `last` parameters.
 * The default format shows the first 4 characters and the last 5 characters of the address.
 *
 * @param address - The full address string that needs to be formatted.
 * @param first - The number of characters to show from the start of the address. Defaults to 4.
 * @param last - The number of characters to show from the end of the address. Defaults to 5.
 * @returns The formatted address string with ellipsis in the middle.
 */

export const formatAddress = (
  address: string,
  {
    first = 4,
    last = 5,
  }: {
    first?: number
    last?: number
  } = {},
) => `${address.slice(0, first)}...${address.slice(-last)}`
