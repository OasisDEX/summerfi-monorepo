import { ChainId } from '@summerfi/serverless-shared'
import { getSdk } from '../generated/client-aave-like'
import type { GraphQLClient } from 'graphql-request'
import type { OasisPosition } from '../types'

export const getAaveLikeSubgraphNameByChainId = (chainId: ChainId): string => {
  const subgraphNameByChainMap: Partial<Record<ChainId, string>> = {
    [ChainId.MAINNET]: 'summer-oasis-history',
    [ChainId.ARBITRUM]: 'summer-oasis-history-arbitrum',
    [ChainId.BASE]: 'summer-oasis-history-base',
    [ChainId.OPTIMISM]: 'summer-oasis-history-optimism',
  }
  const subgraph = subgraphNameByChainMap[chainId]
  if (!subgraph) {
    throw new Error(`No subgraph assigned to Chain ID ${chainId}`)
  }
  return subgraph
}

export const getAaveLikePosition = async (
  client: GraphQLClient,
  positionId: string,
): Promise<OasisPosition | undefined> => {
  const events = (await getSdk(client).GetPosition({ id: positionId })).position?.events
  return events ? { events } : undefined
}
