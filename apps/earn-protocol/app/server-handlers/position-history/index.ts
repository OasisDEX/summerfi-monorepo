'use server'

import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType, SupportedSDKNetworks } from '@summerfi/app-types'
import { GraphQLClient } from 'graphql-request'

import {
  GetPositionHistoryDocument,
  type GetPositionHistoryQuery,
} from '@/graphql/clients/position-history/client'

type GetPositionHistoryParams = {
  network: SupportedSDKNetworks
  address: string
  vault: SDKVaultishType | SDKVaultType
}

export async function getPositionHistory({ network, address, vault }: GetPositionHistoryParams) {
  const positionId = `${address}-${vault.id}`

  // passing next.js fetcher with cache duration
  const customFetchCache = async (url: RequestInfo | URL, params?: RequestInit) =>
    await fetch(url, {
      ...params,
      next: {
        revalidate: REVALIDATION_TIMES.POSITION_HISTORY,
        tags: [REVALIDATION_TAGS.POSITION_HISTORY, address.toLowerCase()],
      },
    })

  const subgraphsMap = {
    [SupportedSDKNetworks.Mainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol`,
    [SupportedSDKNetworks.Base]: `${process.env.SUBGRAPH_BASE}/summer-protocol-base`,
    [SupportedSDKNetworks.ArbitrumOne]: `${process.env.SUBGRAPH_BASE}/summer-protocol-arbitrum`,
    [SupportedSDKNetworks.SonicMainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol-sonic`,
  }

  const isProperNetwork = (net: string): net is keyof typeof subgraphsMap => net in subgraphsMap

  if (!isProperNetwork(network)) {
    throw new Error(`getPositionHistory: No endpoint found for network: ${network}`)
  }

  const networkGraphQlClient = new GraphQLClient(subgraphsMap[network], {
    fetch: customFetchCache,
  })
  const positionHistory = await networkGraphQlClient.request<GetPositionHistoryQuery>(
    GetPositionHistoryDocument,
    {
      positionId,
    },
  )

  return {
    positionHistory,
    vault,
  }
}

export type GetPositionHistoryReturnType = Awaited<ReturnType<typeof getPositionHistory>>
