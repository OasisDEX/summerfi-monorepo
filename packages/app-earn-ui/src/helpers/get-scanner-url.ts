import { type SDKChainId } from '@summerfi/app-types'

const chainsMap: {
  [key in SDKChainId]: string
} = {
  // no trailing slash
  1: 'https://etherscan.io', // MAINNET
  42161: 'https://arbiscan.io', // ARBITRUM
  10: 'https://optimistic.etherscan.io', // OPTIMISM
  8453: 'https://basescan.org', // BASE
  11155111: 'https://sepolia.etherscan.io', // SEPOLIA
}

export const getScannerUrl = (chainId: number, txHash: string) => {
  return `${chainsMap[chainId]}/tx/${txHash}`
}