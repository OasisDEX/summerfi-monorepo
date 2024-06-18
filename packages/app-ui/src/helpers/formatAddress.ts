/* eslint-disable no-magic-numbers */

export const formatAddress = (address: string, first: number = 4, last: number = 5) =>
  `${address.slice(0, first)}...${address.slice(-last)}`
