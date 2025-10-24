import { ChainId } from '@summerfi/serverless-shared'

export const subgraphNameByChainMap: Partial<Record<ChainId, string>> = {
  [ChainId.BASE]: 'summer-institutions-base',
  [ChainId.ARBITRUM]: 'summer-institutions-arbitrum',
  [ChainId.MAINNET]: 'summer-institutions',
  [ChainId.SONIC]: 'summer-institutions-sonic',
}
