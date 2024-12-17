'use server'

import { SDKNetwork, type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import { GraphQLClient } from 'graphql-request'

import {
  GetPositionHistoryDocument,
  type GetPositionHistoryQuery,
} from '@/graphql/clients/position-history/client'

type GetPositionHistoryParams = {
  network: SDKNetwork
  address: string
  vault: SDKVaultishType | SDKVaultType
}

const POSITION_HISTORY_DURATION = 30 // seconds

// passing next.js fetcher with cache duration
const customFetchCache = async (url: RequestInfo | URL, params?: RequestInit) =>
  await fetch(url, { ...params, next: { revalidate: POSITION_HISTORY_DURATION } })

const clients = {
  [SDKNetwork.Base]: new GraphQLClient(`${process.env.SUBGRAPH_BASE}/summer-protocol-base`, {
    fetch: customFetchCache,
  }),
  [SDKNetwork.ArbitrumOne]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-protocol-arbitrum`,
    {
      fetch: customFetchCache,
    },
  ),
}

const isProperNetwork = (network: string): network is keyof typeof clients => network in clients

export async function getPositionHistory({ network, address, vault }: GetPositionHistoryParams) {
  if (!isProperNetwork(network)) {
    throw new Error(`getPositionHistory: No endpoint found for network: ${network}`)
  }

  const positionId = `${address}-${vault.id}`

  const networkGraphQlClient = clients[network as keyof typeof clients]

  return await networkGraphQlClient.request<GetPositionHistoryQuery>(GetPositionHistoryDocument, {
    positionId,
  })
}

export type GetPositionHistoryReturnType = Awaited<ReturnType<typeof getPositionHistory>>
