import { ChainId } from '@summerfi/serverless-shared'

export const subgraphNameByChainMap: Partial<Record<ChainId, string>> = {
  [ChainId.BASE]: 'summer-protocol-base',
  [ChainId.ARBITRUM]: 'summer-protocol-artitrum',
}
