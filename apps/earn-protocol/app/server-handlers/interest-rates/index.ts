'use server'

import { SDKNetwork, type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import { GraphQLClient } from 'graphql-request'

import { REVALIDATION_TIMES } from '@/constants/revalidations'
import {
  GetInterestRatesDocument,
  type GetInterestRatesQuery,
} from '@/graphql/clients/rates/client'
import { getArkProductId } from '@/helpers/prepare-product-id'

type GetInterestRatesParams = {
  network: SDKNetwork
  dailyCount?: number
  hourlyCount?: number
  weeklyCount?: number
  arksList: SDKVaultishType['arks'] | SDKVaultType['arks']
}

const noInterestRates: GetInterestRatesQuery = {
  dailyInterestRates: [{ averageRate: 0, date: 0, __typename: 'DailyInterestRate' }],
  hourlyInterestRates: [{ averageRate: 0, date: 0, __typename: 'HourlyInterestRate' }],
  weeklyInterestRates: [{ averageRate: 0, date: 0, __typename: 'WeeklyInterestRate' }],
  latestInterestRate: [
    {
      rate: [{ rate: 0, timestamp: 0, __typename: 'InterestRate' }],
      __typename: 'HourlyInterestRate',
    },
  ],
}

// passing next.js fetcher with cache duration
const customFetchCache = async (url: RequestInfo | URL, params?: RequestInit) => {
  try {
    return await fetch(url, { ...params, next: { revalidate: REVALIDATION_TIMES.INTEREST_RATES } })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('customFetchCache error', error)

    throw error
  }
}

const clients = {
  [SDKNetwork.Mainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates`,
    {
      fetch: customFetchCache,
    },
  ),
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

  const arkNamesList = arksList.map((ark) =>
    ark.name ? ark.name : getArkProductId(ark) || 'NOT FOUND',
  )

  const networkGraphQlClient = clients[network as keyof typeof clients]
  // networkGraphQlClient.batchRequests DOES NOT WORK on subgraphs we use
  // TODO: create a single gql`` query with multiple queries inside and dynamically rename variables
  const response = await Promise.all(
    arksList.map((ark) => {
      if (getArkProductId(ark) === false) {
        return Promise.resolve<GetInterestRatesQuery>(noInterestRates)
      }

      return networkGraphQlClient.request<GetInterestRatesQuery>(GetInterestRatesDocument, {
        productId: getArkProductId(ark),
      })
    }),
  )

  return arkNamesList.reduce<{
    // key in this case is the ark name
    [key: string]: GetInterestRatesQuery
  }>((acc, arkName, index) => {
    acc[arkName] = response[index]

    return acc
  }, {})
}

export type GetInterestRatesReturnType = Awaited<ReturnType<typeof getInterestRates>>
