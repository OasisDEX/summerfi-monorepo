import { type SupportedNetworkIds } from '@summerfi/app-types'

const chainsMap: {
  [key in SupportedNetworkIds]: string
} = {
  // no trailing slash
  1: 'https://etherscan.io', // MAINNET
  42161: 'https://arbiscan.io', // ARBITRUM
  8453: 'https://basescan.org', // BASE
  146: 'https://sonicscan.org', // SONIC
  999: 'https://hyperevmscan.io', // HYPERLIQUID
}

export const getScannerUrl = (chainId: number, txHash: string) => {
  return `${chainsMap[chainId]}/tx/${txHash}`
}

export const getScannerAddressUrl = (chainId: number, contractAddress: string) => {
  return `${chainsMap[chainId]}/address/${contractAddress}`
}
