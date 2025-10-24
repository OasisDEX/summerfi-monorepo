import { RolesByInstitutionAndNameQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'
import { paginateRoles } from '../utils'

export interface GetRolesByInstitutionAndNameParams {
  institutionId: string
  name: string
}

export async function getRolesByInstitutionAndName(
  params: GetRolesByInstitutionAndNameParams,
  config: SubgraphClientConfig,
): Promise<RolesByInstitutionAndNameQuery['roles']> {
  const client = createClient(config.chainId, config.urlBase)

  try {
    return await paginateRoles(
      (client, queryParams) => client.RolesByInstitutionAndName(queryParams),
      params,
      client,
    )
  } catch (e) {
    console.error('Failed to fetch roles by institution and name:', e)
    throw e
  }
}
