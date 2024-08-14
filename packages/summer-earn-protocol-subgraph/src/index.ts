import { UserPositionsQuery, getSdk } from './client'
import { GraphQLClient } from 'graphql-request'
import { ChainId } from '@summerfi/serverless-shared'

interface SubgraphClientConfig {
  chainId: ChainId
  urlBase: string
}

export interface GetUserPositionsParams {
  userAddress: string
}

const chainIdSubgraphMap: Partial<Record<ChainId, string>> = {
  [ChainId.BASE]: 'summer-protocol-base',
}

const supportedChains = Object.keys(chainIdSubgraphMap).map((k) => parseInt(k))

const getClient = (chainId: ChainId, baseUrl: string) => {
  if (!supportedChains.includes(chainId)) {
    throw new Error(`ChainId ${chainId} not supported
        Supported chains: ${supportedChains}`)
  }
  const subgraph = chainIdSubgraphMap[chainId]
  if (!subgraph) {
    throw new Error(`No subgraph for chainId ${chainId}`)
  }
  const url = `${baseUrl}/${subgraph}`
  const client = new GraphQLClient(url)
  return getSdk(client)
}

export async function getUserPositions(
  params: GetUserPositionsParams,
  config: SubgraphClientConfig,
): Promise<UserPositionsQuery> {
  const client = getClient(config.chainId, config.urlBase)
  try {
    return await getUserPositionsInternal(client, params)
  } catch (e) {
    console.error('Error fetching user positions', e)
    throw e
  }
}

export async function getUserPositionsInternal(
  client: ReturnType<typeof getSdk>,
  params: GetUserPositionsParams,
): Promise<UserPositionsQuery> {
  return await client.UserPositions({ userAddress: params.userAddress })
}
