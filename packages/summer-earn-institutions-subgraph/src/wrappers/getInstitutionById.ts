import { InstitutionByIdQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'

export interface GetInstitutionByIdParams {
  id: string
}

export async function getInstitutionById(
  params: GetInstitutionByIdParams,
  config: SubgraphClientConfig,
): Promise<InstitutionByIdQuery> {
  const client = createClient(config.chainId, config.urlBase)
  try {
    return await getInstitutionByIdInternal(client, params)
  } catch (e) {
    console.error('Failed to fetch institution by id:', e)
    throw e
  }
}

async function getInstitutionByIdInternal(
  client: ReturnType<typeof getSdk>,
  params: GetInstitutionByIdParams,
): Promise<InstitutionByIdQuery> {
  return await client.InstitutionById({ id: params.id })
}
