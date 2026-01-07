import { type ChainId } from '../types/ChainId'
import { ChainIds } from '../implementation/ChainIds'

export type GraphChain = 'mainnet' | 'base' | 'arbitrum' | 'sonic' | 'hyperliquid'

const keyMap: Record<ChainId, GraphChain> = {
  [ChainIds.Mainnet]: 'mainnet',
  [ChainIds.Base]: 'base',
  [ChainIds.ArbitrumOne]: 'arbitrum',
  [ChainIds.Sonic]: 'sonic',
  [ChainIds.HyperEvm]: 'hyperliquid',
}

export const chainIdToGraphChain = (chainId: number) => {
  const chainKey = keyMap[chainId as ChainId]
  if (!chainKey) {
    throw new Error(`chainIdToGraphChain: Unsupported chain ID: ${chainId}`)
  }
  return chainKey
}
