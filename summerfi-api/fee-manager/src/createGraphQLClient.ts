import { GraphQLClient } from 'graphql-request'
import { ChainId } from '@summerfi/serverless-shared'
import { getSdk } from './generated/client'

const getSubgraphNameByChainId = (chainId: ChainId): string => {
  const subgraphNameByChainMap: Partial<Record<ChainId, string>> = {
    [ChainId.MAINNET]: 'subgraph-name',
  }
  const subgraph = subgraphNameByChainMap[chainId]
  if (!subgraph) {
    throw new Error(`No subgraph assigned to Chain ID ${chainId}`)
  }
  return subgraph
}

const validateChainId = (chainId: ChainId): void => {
  const supportedChains = [ChainId.MAINNET]
  if (!supportedChains.includes(chainId)) {
    throw new Error(
      `Chain ID ${chainId} is not supported. Supported chains are: ${supportedChains.join(', ')}`,
    )
  }
}

export const createGraphQLClient = (
  chainId: ChainId,
  baseUrl: string,
): ReturnType<typeof getSdk> => {
  validateChainId(chainId)
  const subgraphName = getSubgraphNameByChainId(chainId)
  const url = `${baseUrl}/${subgraphName}`
  const client = new GraphQLClient(url)
  return getSdk(client)
}
