import { InstitutionVaultsQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'

export interface GetInstitutionVaultsParams {
  id: string
}

export async function getInstitutionVaults(
  params: GetInstitutionVaultsParams,
  config: SubgraphClientConfig,
): Promise<InstitutionVaultsQuery> {
  const client = createClient(config.chainId, config.urlBase)
  try {
    return await getInstitutionVaultsInternal(client, params)
  } catch (e) {
    console.error('Failed to fetch institution vaults:', e)
    throw e
  }
}

async function getInstitutionVaultsInternal(
  client: ReturnType<typeof getSdk>,
  params: GetInstitutionVaultsParams,
): Promise<InstitutionVaultsQuery> {
  return await client.InstitutionVaults({ id: params.id })
}
