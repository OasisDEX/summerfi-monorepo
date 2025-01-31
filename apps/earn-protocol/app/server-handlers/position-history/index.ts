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

  const subgraphsMap = process.env.NEXT_PUBLIC_IS_PRE_LAUNCH_VERSION
    ? {
        [SDKNetwork.Mainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol/version/1.0.0-test-deployment/api`,
        [SDKNetwork.Base]: `${process.env.SUBGRAPH_BASE}/summer-protocol-base/version/1.0.0-test-deployment/api`,
        [SDKNetwork.ArbitrumOne]: `${process.env.SUBGRAPH_BASE}/summer-protocol-arbitrum/version/1.0.0-test-deployment/api`,
      }
    : {
        [SDKNetwork.Mainnet]: `${process.env.SUBGRAPH_BASE}/summer-protocol`,
        [SDKNetwork.Base]: `${process.env.SUBGRAPH_BASE}/summer-protocol-base`,
        [SDKNetwork.ArbitrumOne]: `${process.env.SUBGRAPH_BASE}/summer-protocol-arbitrum`,
      }

  const clients = {
    [SDKNetwork.Mainnet]: new GraphQLClient(subgraphsMap[SDKNetwork.Mainnet], {
      fetch: customFetchCache,
    }),
    [SDKNetwork.Base]: new GraphQLClient(subgraphsMap[SDKNetwork.Base], {
      fetch: customFetchCache,
    }),
    [SDKNetwork.ArbitrumOne]: new GraphQLClient(subgraphsMap[SDKNetwork.ArbitrumOne], {
      fetch: customFetchCache,
    }),
  }

  const isProperNetwork = (net: string): net is keyof typeof clients => net in clients

  if (!isProperNetwork(network)) {
    throw new Error(`getPositionHistory: No endpoint found for network: ${network}`)
  }

  const networkGraphQlClient = clients[network as keyof typeof clients]
  const request = await networkGraphQlClient.request<GetPositionHistoryQuery>(
    GetPositionHistoryDocument,
    {
      positionId,
    },
  )

  return request
}

export type GetPositionHistoryReturnType = Awaited<ReturnType<typeof getPositionHistory>>
