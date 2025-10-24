import { RolesByNameQuery } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'
import { paginateRoles } from '../utils'

export interface GetRolesByNameParams {
  name: string
}

export async function getRolesByName(
  params: GetRolesByNameParams,
  config: SubgraphClientConfig,
): Promise<RolesByNameQuery['roles']> {
  const client = createClient(config.chainId, config.urlBase)

  try {
    return await paginateRoles(
      (client, queryParams) => client.RolesByName(queryParams),
      params,
      client,
    )
  } catch (e) {
    console.error('Failed to fetch roles by name:', e)
    throw e
  }
}
