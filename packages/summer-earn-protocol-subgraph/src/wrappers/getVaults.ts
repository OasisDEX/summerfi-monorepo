import { VaultsQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'

export async function getVaults(config: SubgraphClientConfig): Promise<VaultsQuery> {
  const client = createClient(config.chainId, config.urlBase)
  try {
    return await getVaultsInternal(client)
  } catch (e) {
    console.error('Failed to fetch vaults:', e)
    throw e
  }
}

async function getVaultsInternal(client: ReturnType<typeof getSdk>): Promise<VaultsQuery> {
  return await client.Vaults()
}
