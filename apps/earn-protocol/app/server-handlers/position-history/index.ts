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

const POSITION_HISTORY_DURATION = 120 // seconds

export async function getPositionHistory({ network, address, vault }: GetPositionHistoryParams) {
  const positionId = `${address}-${vault.id}`

  // passing next.js fetcher with cache duration
  const customFetchCache = async (url: RequestInfo | URL, params?: RequestInit) =>
    await fetch(url, {
      ...params,
      next: {
        revalidate: POSITION_HISTORY_DURATION,
        tags: ['position-history', address.toLowerCase()],
      },
    })

  if (!process.env.TEMPORARY_MAINNET_SUBGRAPH) {
    throw new Error('TEMPORARY_MAINNET_SUBGRAPH env variable is not set')
  }

  const clients = {
    // [SDKNetwork.Mainnet]: new GraphQLClient(`${process.env.SUBGRAPH_BASE}/summer-protocol`, {
    [SDKNetwork.Mainnet]: new GraphQLClient(process.env.TEMPORARY_MAINNET_SUBGRAPH, {
      fetch: customFetchCache,
    }),
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

  const isProperNetwork = (net: string): net is keyof typeof clients => net in clients

  if (!isProperNetwork(network)) {
    throw new Error(`getPositionHistory: No endpoint found for network: ${network}`)
  }

  const networkGraphQlClient = clients[network as keyof typeof clients]

  return await networkGraphQlClient.request<GetPositionHistoryQuery>(GetPositionHistoryDocument, {
    positionId,
  })
}

export type GetPositionHistoryReturnType = Awaited<ReturnType<typeof getPositionHistory>>
