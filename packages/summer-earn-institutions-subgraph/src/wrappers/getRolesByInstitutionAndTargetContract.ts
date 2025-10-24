import { RolesByInstitutionAndTargetContractQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'
import { paginateRoles } from '../utils'

export interface GetRolesByInstitutionAndTargetContractParams {
  institutionId: string
  targetContract: string
}

export async function getRolesByInstitutionAndTargetContract(
  params: GetRolesByInstitutionAndTargetContractParams,
  config: SubgraphClientConfig,
): Promise<RolesByInstitutionAndTargetContractQuery['roles']> {
  const client = createClient(config.chainId, config.urlBase)

  try {
    return await paginateRoles(
      (client, queryParams) => client.RolesByInstitutionAndTargetContract(queryParams),
      params,
      client,
    )
  } catch (e) {
    console.error('Failed to fetch roles by institution and target contract:', e)
    throw e
  }
}
