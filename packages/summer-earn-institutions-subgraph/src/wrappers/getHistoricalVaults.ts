import { HistoricalVaultsQuery, getSdk } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'

export interface GetHistoricalVaultsParams {
  blockNumber: number
}

export async function getHistoricalVaults(
  params: GetHistoricalVaultsParams,
  config: SubgraphClientConfig,
): Promise<HistoricalVaultsQuery> {
  const client = createClient(config.chainId, config.urlBase)
  try {
    return await getHistoricalVaultsInternal(client, params)
  } catch (e) {
    console.error('Failed to fetch historical vaults:', e)
    throw e
  }
}

async function getHistoricalVaultsInternal(
  client: ReturnType<typeof getSdk>,
  params: GetHistoricalVaultsParams,
): Promise<HistoricalVaultsQuery> {
  return await client.HistoricalVaults({ blockNumber: params.blockNumber })
}
