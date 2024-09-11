import { GraphQLClient } from 'graphql-request'
import { ChainId } from '@summerfi/serverless-shared'
import { supportedChains } from './supportedChains'
import { subgraphNameByChainMap } from './subgraphNameByChainMap'
import { getSdk } from '../generated/client'

export const createGraphQLClient = (chainId: ChainId, baseUrl: string) => {
  if (!supportedChains.includes(chainId)) {
    throw new Error(
      `Chain ID ${chainId} is not supported. Supported chains are: ${supportedChains.join(', ')}`,
    )
  }
  const subgraph = subgraphNameByChainMap[chainId]
  if (!subgraph) {
    throw new Error(`No subgraph found for Chain ID ${chainId}`)
  }
  const url = `${baseUrl}/${subgraph}`
  const client = new GraphQLClient(url)
  return getSdk(client)
}
