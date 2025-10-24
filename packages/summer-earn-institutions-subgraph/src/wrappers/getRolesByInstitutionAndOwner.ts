import { RolesByInstitutionAndOwnerQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'
import { paginateRoles } from '../utils'

export interface GetRolesByInstitutionAndOwnerParams {
  institutionId: string
  owner: string
}

export async function getRolesByInstitutionAndOwner(
  params: GetRolesByInstitutionAndOwnerParams,
  config: SubgraphClientConfig,
): Promise<RolesByInstitutionAndOwnerQuery['roles']> {
  const client = createClient(config.chainId, config.urlBase)

  try {
    return await paginateRoles(
      (client, queryParams) => client.RolesByInstitutionAndOwner(queryParams),
      params,
      client,
    )
  } catch (e) {
    console.error('Failed to fetch roles by institution and owner:', e)
    throw e
  }
}
