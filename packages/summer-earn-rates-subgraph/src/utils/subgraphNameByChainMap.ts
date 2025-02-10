import { ChainId } from '@summerfi/serverless-shared'

export const subgraphNameByChainMap: Partial<Record<ChainId, string>> = {
  [ChainId.BASE]: 'summer-earn-protocol-rates-base',
  [ChainId.ARBITRUM]: 'summer-earn-protocol-rates-arbitrum',
  [ChainId.OPTIMISM]: 'summer-earn-protocol-rates-optimism',
  [ChainId.MAINNET]: 'summer-earn-protocol-rates',
}
