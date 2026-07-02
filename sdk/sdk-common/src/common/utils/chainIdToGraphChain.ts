import { type ChainId } from '../types/ChainId'
import { ChainIds } from '../implementation/ChainIds'

/** Chain slug used by the SDK's subgraph endpoints. */
export type GraphChain = 'mainnet' | 'base' | 'arbitrum' | 'sonic' | 'hyperliquid'

const keyMap: Record<ChainId, GraphChain> = {
  [ChainIds.Mainnet]: 'mainnet',
  [ChainIds.Base]: 'base',
  [ChainIds.ArbitrumOne]: 'arbitrum',
  [ChainIds.Sonic]: 'sonic',
  [ChainIds.Hyperliquid]: 'hyperliquid',
}

/**
 * Maps a numeric chain id to its subgraph {@link GraphChain} slug.
 *
 * @param chainId - The numeric chain id to map.
 * @returns The corresponding subgraph chain slug.
 * @throws Error if the chain id is not supported.
 */
export const chainIdToGraphChain = (chainId: number) => {
  const chainKey = keyMap[chainId as ChainId]
  if (!chainKey) {
    throw new Error(`chainIdToGraphChain: Unsupported chain ID: ${chainId}`)
  }
  return chainKey
}
