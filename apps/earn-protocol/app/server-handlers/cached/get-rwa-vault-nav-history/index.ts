'use server'

import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { GraphQLClient } from 'graphql-request'

import { rwaSubgraphsMap } from '@/app/server-handlers/subgraphs-map'
import { CACHE_TIMES } from '@/constants/revalidation'
import {
  GetRwaVaultNavHistoryDocument,
  type GetRwaVaultNavHistoryQuery,
} from '@/graphql/clients/rwa-vault-nav-history/client'

type GetRwaVaultNavHistoryParams = {
  network: SupportedSDKNetworks
  vaultId: string
}

const _rwaVaultNavHistoryCache = new Map<
  string,
  { data: GetRwaVaultNavHistoryQuery; expiresAt: number }
>()

const isProperRwaNetwork = (net: string): net is keyof typeof rwaSubgraphsMap =>
  net in rwaSubgraphsMap

// Fetches the RWA vault NAV (pricePerShare) history directly from the institutions subgraph so the
// "Historical NAV price" chart can be built in-app without extending the SDK / shared packages.
export async function getCachedRwaVaultNavHistory({
  network,
  vaultId,
}: GetRwaVaultNavHistoryParams) {
  if (!isProperRwaNetwork(network)) {
    throw new Error(`getCachedRwaVaultNavHistory: No RWA endpoint found for network: ${network}`)
  }

  const cacheKey = `${network}:${vaultId}`
  const now = Date.now()
  const cached = _rwaVaultNavHistoryCache.get(cacheKey)

  if (cached && cached.expiresAt > now) {
    return cached.data
  }

  const networkGraphQlClient = new GraphQLClient(rwaSubgraphsMap[network])

  const data = await networkGraphQlClient.request<GetRwaVaultNavHistoryQuery>(
    GetRwaVaultNavHistoryDocument,
    {
      vaultId,
    },
    {
      origin: 'earn-protocol-app',
    },
  )

  _rwaVaultNavHistoryCache.set(cacheKey, {
    data,
    expiresAt: now + Number(CACHE_TIMES.RWA_NAV_HISTORY * 1000),
  })

  return data
}

export type GetRwaVaultNavHistoryReturnType = GetRwaVaultNavHistoryQuery
