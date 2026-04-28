import { ChainIds, type ChainId } from '@summerfi/sdk-common'

export const cowChainNames: Partial<Record<ChainId, string>> = {
  [ChainIds.Mainnet]: 'mainnet',
  [ChainIds.Base]: 'base',
  [ChainIds.ArbitrumOne]: 'arbitrum',
} as const

export function getCowChainName(chainId: ChainId): string {
  const name = cowChainNames[chainId]
  if (!name) {
    throw new Error(`No CoW chain name found for chainId: ${chainId}`)
  }
  return name
}
