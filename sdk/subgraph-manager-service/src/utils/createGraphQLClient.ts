import { getSdk } from '../generated/client'
import { GraphQLClient } from 'graphql-request'
import { supportedChains, subgraphNameByChainMap } from '@summerfi/summer-earn-protocol-subgraph'
import { ChainId } from '@summerfi/serverless-shared'

export const createGraptQLClient = (chainId: ChainId, baseUrl: string) => {
  if (!supportedChains.includes(chainId)) {
    throw new Error(
      `ChainId ${chainId} not supported. Supported chains: ${supportedChains.join(', ')}`,
    )
  }
  const subgraph = subgraphNameByChainMap[chainId]
  if (!subgraph) {
    throw new Error(`No subgraph for chainId ${chainId}`)
  }
  const url = `${baseUrl}/${subgraph}`
  const client = new GraphQLClient(url)
  return getSdk(client)
}
