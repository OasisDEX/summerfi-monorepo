'use server'

import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type GetInterestRatesParams, SDKNetwork } from '@summerfi/app-types'
import { getArkHistoricalRatesUrl, getArkProductId, getArkRatesUrl } from '@summerfi/app-utils'
import { GraphQLClient } from 'graphql-request'

import {
  GetInterestRatesDocument,
  type GetInterestRatesQuery,
} from '@/graphql/clients/rates/client'

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
    return await fetch(url, {
      ...params,
      next: {
        revalidate: REVALIDATION_TIMES.INTEREST_RATES,
        tags: [REVALIDATION_TAGS.INTEREST_RATES],
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('customFetchCache error:', error)

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

if (!process.env.FUNCTIONS_API_URL) {
  throw new Error('FUNCTIONS_API_URL is not set')
}

const isProperNetwork = (network: string): network is keyof typeof clients => network in clients

// CAUTION - IF SOMETHING IS UPDATED HERE UPDATE IT ALSO IN EARN PROTOCOL APP
export async function getInterestRates({
  network,
  arksList,
  justLatestRates = false,
}: GetInterestRatesParams) {
  if (!isProperNetwork(network)) {
    throw new Error(`getInterestRates: No endpoint found for network: ${network}`)
  }

  const filteredArksWithCapHigherThanZero = arksList.filter((ark) => Number(ark.depositCap) > 0)

  const arkNamesList = filteredArksWithCapHigherThanZero.map((ark) =>
    ark.name ? ark.name : getArkProductId(ark) || 'NOT FOUND',
  )

  const response = await Promise.all(
    filteredArksWithCapHigherThanZero.map(async (ark) => {
      const productId = getArkProductId(ark)

      if (productId === false) {
        return noInterestRates
      }

      try {
        const functionsApiUrl = process.env.FUNCTIONS_API_URL

        if (!functionsApiUrl) {
          throw new Error('FUNCTIONS_API_URL is not set')
        }

        const resolvedUrl = justLatestRates
          ? getArkRatesUrl({
              network,
              apiUrl: functionsApiUrl,
            })
          : getArkHistoricalRatesUrl({
              network,
              apiUrl: functionsApiUrl,
            })

        // Try primary source first
        const apiUrl = `${resolvedUrl}?productId=${productId}`
        const apiResponse = await fetch(apiUrl, {
          next: {
            revalidate: REVALIDATION_TIMES.INTEREST_RATES,
            tags: [REVALIDATION_TAGS.INTEREST_RATES],
          },
        })

        if (!apiResponse.ok) {
          throw new Error('Primary API request failed')
        }

        const data = await apiResponse.json()

        if (justLatestRates) {
          if (!data.interestRates?.length) {
            return noInterestRates
          }

          // map response from rates endpoint to match the expected format
          return {
            ...noInterestRates,
            latestInterestRate: [{ rate: [data.interestRates[0]] }],
          }
        }

        return data
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Falling back to subgraph for ${productId}:`, error)
        const networkGraphQlClient = clients[network]

        return networkGraphQlClient.request<GetInterestRatesQuery>(GetInterestRatesDocument, {
          productId,
        })
      }
    }),
  )

  return arkNamesList.reduce<{
    [key: string]: GetInterestRatesQuery
  }>((acc, arkName, index) => {
    acc[arkName] = response[index]

    return acc
  }, {})
}

export type GetInterestRatesReturnType = Awaited<ReturnType<typeof getInterestRates>>
