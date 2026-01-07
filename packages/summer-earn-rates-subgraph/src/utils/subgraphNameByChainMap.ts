import { ChainId } from '@summerfi/serverless-shared'

export const subgraphNameByChainMap: Partial<Record<ChainId, string>> = {
  [ChainId.BASE]: 'summer-earn-protocol-rates-base',
  [ChainId.ARBITRUM]: 'summer-earn-protocol-rates-arbitrum',
  [ChainId.MAINNET]: 'summer-earn-protocol-rates',
  [ChainId.SONIC]: 'summer-earn-protocol-rates-sonic',
  [ChainId.HYPERLIQUID]: 'summer-earn-protocol-rates-hyperliquid',
}
