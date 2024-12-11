'use server'

import { SDKNetwork, type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import { GraphQLClient } from 'graphql-request'

import {
  GetInterestRatesDocument,
  type GetInterestRatesQuery,
} from '@/graphql/clients/rates/client'
import { getArkProductId, getArkProductIdList } from '@/helpers/prepare-product-id'

type GetInterestRatesParams = {
  network: SDKNetwork
  dailyCount?: number
  hourlyCount?: number
  weeklyCount?: number
  arksList: SDKVaultishType['arks'] | SDKVaultType['arks']
}

const INTEREST_RATE_CACHE_DURATION = 30 // seconds

// passing next.js fetcher with cache duration
const customFetchCache = async (url: RequestInfo | URL, params?: RequestInit) =>
  await fetch(url, { ...params, next: { revalidate: INTEREST_RATE_CACHE_DURATION } })

const clients = {
  [SDKNetwork.Base]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-base`,
    {
      fetch: customFetchCache,
    },
  ),
  [SDKNetwork.ArbitrumOne]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-arbitrum`,
    {
      fetch: customFetchCache,
    },
  ),
}

const isProperNetwork = (network: string): network is keyof typeof clients => network in clients

export async function getInterestRates({ network, arksList }: GetInterestRatesParams) {
  if (!isProperNetwork(network)) {
    throw new Error(`getInterestRates: No endpoint found for network: ${network}`)
  }

  const productIds = getArkProductIdList(arksList)

  const networkGraphQlClient = clients[network as keyof typeof clients]
  // networkGraphQlClient.batchRequests DOES NOT WORK on subgraphs we use
  // TODO: create a single gql`` query with multiple queries inside and dynamically rename variables
  const response = await Promise.all(
    arksList.map((ark) => {
      return networkGraphQlClient
        .request<GetInterestRatesQuery>(GetInterestRatesDocument, {
          productId: getArkProductId(ark),
        })
        .then((data) => ({ ...data, tokenSymbol: ark.inputToken.symbol }))
    }),
  )

  return productIds.reduce<{
    [key: string]: GetInterestRatesQuery & {
      tokenSymbol: string
    }
  }>((acc, productId, index) => {
    acc[productId] = response[index]

    return acc
  }, {})
}

export type GetInterestRatesReturnType = Awaited<ReturnType<typeof getInterestRates>>
