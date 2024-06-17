/* eslint-disable no-magic-numbers */

export function formatAddress(address: string, first: number = 4, last: number = 5) {
  return `${address.slice(0, first)}...${address.slice(-last)}`
}
