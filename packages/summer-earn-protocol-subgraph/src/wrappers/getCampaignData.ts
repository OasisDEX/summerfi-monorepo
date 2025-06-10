import { OkxQuestDataQuery as OkxQuestDataQueryType } from '../generated/client'
import { createClient } from '../createClient'
import { SubgraphClientConfig } from '../types'

export interface GetCampaignDataParams {
  campaign: 'okx'
  userAddress: string
}

export async function getCampaignData(
  params: GetCampaignDataParams,
  config: SubgraphClientConfig,
): Promise<OkxQuestDataQueryType> {
  if (params.campaign !== 'okx') {
    throw new Error(`Unsupported campaign: ${params.campaign}`)
  }
  const client = createClient(config.chainId, config.urlBase)
  try {
    if (params.campaign === 'okx') {
      return await client.OkxQuestData({
        userAddressID: params.userAddress,
        userAddressString: params.userAddress,
      })
    }
    throw new Error(`Unsupported campaign: ${params.campaign}`)
  } catch (e) {
    console.error('Failed to fetch user positions:', e)
    throw e
  }
}

export type { OkxQuestDataQueryType as OkxQuestDataQuery }
