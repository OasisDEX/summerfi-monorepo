import { AllRolesQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'
import { paginateRoles } from '../utils'

export async function getAllRoles(config: SubgraphClientConfig): Promise<AllRolesQuery['roles']> {
  const client = createClient(config.chainId, config.urlBase)

  try {
    return await paginateRoles((client, params) => client.AllRoles(params), {}, client)
  } catch (e) {
    console.error('Failed to fetch all roles:', e)
    throw e
  }
}
