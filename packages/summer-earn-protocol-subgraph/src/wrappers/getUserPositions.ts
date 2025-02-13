import { UserPositionsQuery as UserPositionsQueryType, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'

export interface GetUserPositionsParams {
  userAddress: string
}

export async function getUserPositions(
  params: GetUserPositionsParams,
  config: SubgraphClientConfig,
): Promise<UserPositionsQuery> {
  const client = createClient(config.chainId, config.urlBase)
  try {
    return await getUserPositionsInternal(client, params)
  } catch (e) {
    console.error('Failed to fetch user positions:', e)
    throw e
  }
}

async function getUserPositionsInternal(
  client: ReturnType<typeof getSdk>,
  params: GetUserPositionsParams,
): Promise<UserPositionsQuery> {
  return await client.UserPositions({ userAddress: params.userAddress })
}

export type UserPositionsQuery = UserPositionsQueryType
