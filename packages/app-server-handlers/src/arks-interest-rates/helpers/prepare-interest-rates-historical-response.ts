import { getArkHistoricalRatesUrl, getArkProductId } from '@summerfi/app-utils'
import {
  GetInterestRatesDocument,
  type GetInterestRatesQuery,
} from '@summerfi/summer-earn-rates-subgraph'

import { graphqlClients, noInterestRates } from '@/arks-interest-rates/constants'
import { type ArkType } from '@/arks-interest-rates/types'

/**
 * Creates a function to fetch historical interest rates for individual Arks with fallback.
 * 
 * This function returns a callable that attempts to fetch historical interest rates
 * (daily, hourly, weekly) for a single Ark via the primary API endpoint. If the
 * primary API fails, it falls back to the GraphQL subgraph for complete historical data.
 * 
 * @param {Object} params - Configuration parameters for historical rate fetching
 * @param {keyof typeof graphqlClients} params.network - The blockchain network to query
 * @param {string} params.functionsApiUrl - Base URL for the functions API
 * @returns {Function} A function that takes an Ark and returns its historical interest rates data
 * 
 * @example
 * ```typescript
 * const historicalCaller = prepareInterestRatesHistoricalResponse({
 *   network: 'Mainnet',
 *   functionsApiUrl: 'https://api.example.com'
 * });
 * const historicalRates = await historicalCaller(arkObject);
 * ```
 */
export const prepareInterestRatesHistoricalResponse =
  ({
    network,
    functionsApiUrl,
  }: {
    network: keyof typeof graphqlClients
    functionsApiUrl: string
  }) =>
  async (ark: ArkType): Promise<GetInterestRatesQuery> => {
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
      })

      if (!apiResponse.ok) {
        throw new Error('Primary API request failed')
      }

      const data = await apiResponse.json()

      return data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Falling back to subgraph for ${productId}:`, error)
      const networkGraphQlClient = graphqlClients[network]

      return networkGraphQlClient.request<GetInterestRatesQuery>(GetInterestRatesDocument, {
        productId,
      })
    }
  }
