import { formatAddress } from '@summerfi/app-utils'

export const getDisplayToken = (
  tokenSymbol: string,
  config?: {
    swapUSDT: boolean
  },
): string => {
  // MKR on arbitrum
  if (tokenSymbol === '4d4b520000000000000000000000000000000000000000000000000000000000') {
    return 'MKR'
  }

  if (tokenSymbol.toLowerCase() === 'usdce') {
    return 'USDC.e'
  }

  if (tokenSymbol.length > 15) {
    return formatAddress(tokenSymbol, { first: 3, last: 3 })
  }

  const token = tokenSymbol === 'WETH' ? 'ETH' : tokenSymbol

  if (config?.swapUSDT && tokenSymbol === 'USD₮0') {
    return token.replace('USD₮0', 'USDT')
  }

  return token
}
