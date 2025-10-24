import { RolesByInstitutionQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'
import { paginateRoles } from '../utils'

export interface GetRolesByInstitutionParams {
  institutionId: string
}

export async function getRolesByInstitution(
  params: GetRolesByInstitutionParams,
  config: SubgraphClientConfig,
): Promise<RolesByInstitutionQuery['roles']> {
  const client = createClient(config.chainId, config.urlBase)

  try {
    return await paginateRoles(
      (client, queryParams) => client.RolesByInstitution(queryParams),
      params,
      client,
    )
  } catch (e) {
    console.error('Failed to fetch roles by institution:', e)
    throw e
  }
}
