import { RolesByTargetContractQuery } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'
import { paginateRoles } from '../utils'

export interface GetRolesByTargetContractParams {
  targetContract: string
}

export async function getRolesByTargetContract(
  params: GetRolesByTargetContractParams,
  config: SubgraphClientConfig,
): Promise<RolesByTargetContractQuery['roles']> {
  const client = createClient(config.chainId, config.urlBase)

  try {
    return await paginateRoles(
      (client, queryParams) => client.RolesByTargetContract(queryParams),
      params,
      client,
    )
  } catch (e) {
    console.error('Failed to fetch roles by target contract:', e)
    throw e
  }
}
