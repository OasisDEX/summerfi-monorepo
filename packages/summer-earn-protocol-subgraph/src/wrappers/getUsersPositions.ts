import { UserPositionsQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'

export interface GetUsersPositionsParams {
  userAddresses: string[]
}

export async function getUsersPositions(
  params: GetUsersPositionsParams,
  config: SubgraphClientConfig,
): Promise<UserPositionsQuery> {
  const client = createClient(config.chainId, config.urlBase)
  try {
    return await getUsersPositionsInternal(client, params)
  } catch (e) {
    console.error('Failed to fetch user positions:', e)
    throw e
  }
}

async function getUsersPositionsInternal(
  client: ReturnType<typeof getSdk>,
  params: GetUsersPositionsParams,
): Promise<UserPositionsQuery> {
  return await client.UsersPositions({ userAddresses: params.userAddresses })
}
