import { ChainId } from '@summerfi/serverless-shared'
import { getSdk } from '../generated/client-ajna-v2'
import type { GraphQLClient } from 'graphql-request'
import type { OasisPosition } from '../types'

export const getAjnaSubgraphNameByChainId = (chainId: ChainId): string => {
  const subgraphNameByChainMap: Partial<Record<ChainId, string>> = {
    [ChainId.MAINNET]: 'summer-ajna-v2',
    [ChainId.BASE]: 'summer-ajna-v2-base',
  }
  const subgraph = subgraphNameByChainMap[chainId]
  if (!subgraph) {
    throw new Error(`No subgraph assigned to Chain ID ${chainId}`)
  }
  return subgraph
}

export const getAjnaPosition = async (
  client: GraphQLClient,
  positionId: string,
): Promise<OasisPosition | undefined> => {
  const events = (await getSdk(client).GetPosition({ id: positionId })).earnPosition?.oasisEvents
  return events ? { events } : undefined
}
