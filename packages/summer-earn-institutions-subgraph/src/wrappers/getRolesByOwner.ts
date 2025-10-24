import { RolesByOwnerQuery } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'
import { paginateRoles } from '../utils'

export interface GetRolesByOwnerParams {
  owner: string
}

export async function getRolesByOwner(
  params: GetRolesByOwnerParams,
  config: SubgraphClientConfig,
): Promise<RolesByOwnerQuery['roles']> {
  const client = createClient(config.chainId, config.urlBase)

  try {
    return await paginateRoles(
      (client, queryParams) => client.RolesByOwner(queryParams),
      params,
      client,
    )
  } catch (e) {
    console.error('Failed to fetch roles by owner:', e)
    throw e
  }
}
