import { InstitutionsQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'

export async function getInstitutions(config: SubgraphClientConfig): Promise<InstitutionsQuery> {
  const client = createClient(config.chainId, config.urlBase)
  try {
    return await getInstitutionsInternal(client)
  } catch (e) {
    console.error('Failed to fetch institutions:', e)
    throw e
  }
}

async function getInstitutionsInternal(
  client: ReturnType<typeof getSdk>,
): Promise<InstitutionsQuery> {
  return await client.Institutions()
}
