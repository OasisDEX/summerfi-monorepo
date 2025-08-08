import { getArkProductId, getArkRatesUrl } from '@summerfi/app-utils'
import {
  GetInterestRatesDocument,
  type GetInterestRatesQuery,
} from '@summerfi/summer-earn-rates-subgraph'

import { graphqlClients, noInterestRates } from '@/arks-interest-rates/constants'
import { type ArkType } from '@/arks-interest-rates/types'

/**
 * Creates a function to fetch individual Ark interest rates with fallback mechanism.
 * 
 * This function returns a callable that attempts to fetch latest interest rates
 * for a single Ark via the primary API endpoint. If the primary API fails,
 * it falls back to the GraphQL subgraph. Includes performance timing for
 * monitoring API response times.
 * 
 * @param {Object} params - Configuration parameters for the fallback calls
 * @param {keyof typeof graphqlClients} params.network - The blockchain network to query
 * @param {string} params.functionsApiUrl - Base URL for the functions API
 * @returns {Function} A function that takes an Ark and returns its interest rates data
 * 
 * @example
 * ```typescript
 * const fallbackCaller = prepareInterestRatesFallbackCalls({
 *   network: 'Mainnet',
 *   functionsApiUrl: 'https://api.example.com'
 * });
 * const rates = await fallbackCaller(arkObject);
 * ```
 */
export const prepareInterestRatesFallbackCalls =
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
      const resolvedUrl = getArkRatesUrl({
        network,
        apiUrl: functionsApiUrl,
      })

      // Try primary source first
      const startTime = performance.now()
      const apiUrl = `${resolvedUrl}?productId=${productId}`
      const apiResponse = await fetch(apiUrl, {
        cache: 'no-store',
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
      const networkGraphQlClient = graphqlClients[network]

      return networkGraphQlClient.request<GetInterestRatesQuery>(GetInterestRatesDocument, {
        productId,
      })
    }
  }
