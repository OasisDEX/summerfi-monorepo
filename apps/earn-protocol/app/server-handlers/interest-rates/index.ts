'use server'

import { type GetInterestRatesParams, SDKNetwork } from '@summerfi/app-types'
import {
  getArkHistoricalRatesUrl,
  getArkProductId,
  getArkRatesBatchUrl,
  getArkRatesUrl,
} from '@summerfi/app-utils'
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

const clients = {
  [SDKNetwork.Mainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates`,
  ),
  [SDKNetwork.Base]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-base`,
  ),
  [SDKNetwork.ArbitrumOne]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-arbitrum`,
  ),
  [SDKNetwork.SonicMainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-sonic`,
  ),
}

if (!process.env.FUNCTIONS_API_URL) {
  throw new Error('FUNCTIONS_API_URL is not set')
}

const isProperNetwork = (network: string): network is keyof typeof clients => network in clients

// CAUTION - IF SOMETHING IS UPDATED HERE UPDATE IT ALSO IN EARN LANDING APP
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
  const functionsApiUrl = process.env.FUNCTIONS_API_URL

  if (!functionsApiUrl) {
    throw new Error('FUNCTIONS_API_URL is not set')
  }

  if (justLatestRates) {
    try {
      // Get all product IDs
      const productIds = filteredArksWithCapHigherThanZero
        .map((ark) => getArkProductId(ark))
        .filter((id): id is string => id !== false)

      // Call the POST endpoint
      const apiResponse = await fetch(getArkRatesBatchUrl({ apiUrl: functionsApiUrl }), {
        method: 'POST',
        body: JSON.stringify({ productIds }),
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: {
          revalidate: 0,
        },
      })

      if (!apiResponse.ok) {
        // eslint-disable-next-line no-console
        console.warn('Batch API request failed with status:', apiResponse.status)

        throw new Error('Batch API request failed')
      }

      const data = await apiResponse.json()

      // Validate the response data
      if (!data.interestRates) {
        // eslint-disable-next-line no-console
        console.warn('Invalid batch response format:', data)

        throw new Error('Invalid batch response format')
      }

      // Map the response and create the named object structure
      const response = filteredArksWithCapHigherThanZero.map((ark) => {
        const productId = getArkProductId(ark)

        if (productId === false || !data.interestRates[productId]?.length) {
          if (!ark.name?.includes('Buffer')) {
            // eslint-disable-next-line no-console
            console.warn(`No rates found for product ${productId} - ${ark.name ?? 'NOT FOUND'}`)
          }

          return noInterestRates
        }

        return {
          ...noInterestRates,
          latestInterestRate: [{ rate: [data.interestRates[productId][0]] }],
        }
      })

      // Return early with the batch response
      return arkNamesList.reduce<{
        [key: string]: GetInterestRatesQuery
      }>((acc, arkName, index) => {
        acc[arkName] = response[index]

        return acc
      }, {})
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Batch request failed, falling back to individual requests:', error)
      // Fall back to individual requests
      const fallbackResponse = await Promise.all(
        filteredArksWithCapHigherThanZero.map(async (ark) => {
          const productId = getArkProductId(ark)

          if (productId === false) {
            return noInterestRates
          }

          try {
            const resolvedUrl = getArkRatesUrl({
              network,
              apiUrl: functionsApiUrl,
            })

            // Try primary source first
            const startTime = performance.now()
            const apiUrl = `${resolvedUrl}?productId=${productId}`
            const apiResponse = await fetch(apiUrl, {
              cache: 'no-store',
              next: {
                revalidate: 0,
              },
            })
            const endTime = performance.now()

            // eslint-disable-next-line no-console
            console.log(`Time taken for primary API request: ${endTime - startTime} milliseconds`)
            if (!apiResponse.ok) {
              throw new Error('Primary API request failed')
            }

            const data = await apiResponse.json()

            if (!data.interestRates?.length) {
              return noInterestRates
            }

            // map response from rates endpoint to match the expected format
            return {
              ...noInterestRates,
              latestInterestRate: [{ rate: [data.interestRates[0]] }],
            }
          } catch (fallbackError) {
            // eslint-disable-next-line no-console
            console.warn(`Falling back to subgraph for ${productId}:`, fallbackError)
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
        acc[arkName] = fallbackResponse[index]

        return acc
      }, {})
    }
  }

  // Proceed with existing historical rates logic
  const historicalResponse = await Promise.all(
    filteredArksWithCapHigherThanZero.map(async (ark) => {
      const productId = getArkProductId(ark)

      if (productId === false) {
        return noInterestRates
      }

      try {
        const resolvedUrl = getArkHistoricalRatesUrl({
          network,
          apiUrl: functionsApiUrl,
        })

        // Try primary source first
        const apiUrl = `${resolvedUrl}?productId=${productId}`
        const apiResponse = await fetch(apiUrl, {
          cache: 'no-store',
          next: {
            revalidate: 0,
          },
        })

        if (!apiResponse.ok) {
          throw new Error('Primary API request failed')
        }

        const data = await apiResponse.json()

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
    acc[arkName] = historicalResponse[index]

    return acc
  }, {})
}

export type GetInterestRatesReturnType = Awaited<ReturnType<typeof getInterestRates>>
