import { UsersQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'

export interface GetUsersParams {
  first: number
  skip: number
}

export async function getUsers(
  params: GetUsersParams,
  config: SubgraphClientConfig,
): Promise<UsersQuery> {
  const client = createClient(config.chainId, config.urlBase)
  try {
    return await getUsersInternal(client, params)
  } catch (e) {
    console.error('Failed to fetch users:', e)
    throw e
  }
}

async function getUsersInternal(
  client: ReturnType<typeof getSdk>,
  params: GetUsersParams,
): Promise<UsersQuery> {
  return await client.Users({ first: params.first, skip: params.skip })
}
