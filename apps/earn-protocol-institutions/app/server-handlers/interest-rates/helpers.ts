import { type GetInterestRatesParams, SupportedSDKNetworks } from '@summerfi/app-types'
import { getArkHistoricalRatesUrl, getArkProductId, getArkRatesUrl } from '@summerfi/app-utils'
import {
  GetInterestRatesDocument,
  type GetInterestRatesQuery,
} from '@summerfi/summer-earn-rates-subgraph'
import { GraphQLClient } from 'graphql-request'

const noInterestRates: GetInterestRatesQuery = {
  dailyInterestRates: [{ id: '0', averageRate: 0, date: '0' }],
  hourlyInterestRates: [{ id: '0', averageRate: 0, date: '0' }],
  weeklyInterestRates: [{ id: '0', averageRate: 0, date: '0' }],
  latestInterestRate: [
    {
      rate: [{ id: '0', rate: 0, timestamp: '0' }],
    },
  ],
}

const clients = {
  [SupportedSDKNetworks.Mainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates`,
  ),
  [SupportedSDKNetworks.Base]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-base`,
  ),
  [SupportedSDKNetworks.ArbitrumOne]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-arbitrum`,
  ),
  [SupportedSDKNetworks.SonicMainnet]: new GraphQLClient(
    `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-sonic`,
  ),
}

type ArkType = GetInterestRatesParams['arksList'][number]

export const isProperInterestRatesNetwork = (network: string): network is keyof typeof clients =>
  network in clients

export const filterArksWithCapHigherThanZero = (ark: ArkType) =>
  Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0

export const interestRatesMapArkName = (ark: ArkType) =>
  ark.name ? ark.name : getArkProductId(ark) || 'NOT FOUND'

export const mapLatestInterestRatesResponse =
  (data: {
    interestRates: {
      [key: string]: {
        id: string
        rate: number
        timestamp: string
      }[]
    }
  }) =>
  (ark: ArkType): GetInterestRatesQuery => {
    const productId = getArkProductId(ark)

    if (productId === false || !data.interestRates[productId].length) {
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
  }

export const prepareInterestRatesDataResponse = ({
  arkNamesList,
  interestRatesMap,
}: {
  arkNamesList: string[]
  interestRatesMap: GetInterestRatesQuery[]
}): { [key: string]: GetInterestRatesQuery } => {
  const result: { [key: string]: GetInterestRatesQuery } = {}

  for (let i = 0; i < arkNamesList.length; i++) {
    const arkName = arkNamesList[i]

    result[arkName] = interestRatesMap[i]
  }

  return result
}

export const prepareInterestRatesFallbackCalls =
  ({ network, functionsApiUrl }: { network: keyof typeof clients; functionsApiUrl: string }) =>
  async (ark: ArkType) => {
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
  }

export const prepareInterestRatesHistoricalResponse =
  ({ network, functionsApiUrl }: { network: keyof typeof clients; functionsApiUrl: string }) =>
  async (ark: ArkType) => {
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
  }
