import { formatAddress } from '@summerfi/app-utils'

export const getDisplayToken = (tokenSymbol: string): string => {
  // MKR on arbitrum
  if (tokenSymbol === '4d4b520000000000000000000000000000000000000000000000000000000000') {
    return 'MKR'
  }

  if (tokenSymbol.length > 15) {
    return formatAddress(tokenSymbol, { first: 3, last: 3 })
  }

  return tokenSymbol === 'WETH' ? 'ETH' : tokenSymbol
}
