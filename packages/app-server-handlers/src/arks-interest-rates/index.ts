'use server'

import { type GetInterestRatesParams, type InterestRates } from '@summerfi/app-types'
import { getArkProductId, getArkRatesBatchUrl } from '@summerfi/app-utils'

import { filterArksWithCapHigherThanZero } from '@/arks-interest-rates/helpers/filter-arks-with-cap-higher-than-zero'
import { isProperInterestRatesNetwork } from '@/arks-interest-rates/helpers/is-proper-interest-rates-network'
import { mapArkName } from '@/arks-interest-rates/helpers/map-ark-name'
import { mapLatestInterestRatesResponse } from '@/arks-interest-rates/helpers/map-latest-interest-rates-response'
import { prepareInterestRatesDataResponse } from '@/arks-interest-rates/helpers/prepare-interest-rates-data-response'
import { prepareInterestRatesFallbackCalls } from '@/arks-interest-rates/helpers/prepare-interest-rates-fallback-calls'
import { prepareInterestRatesHistoricalResponse } from '@/arks-interest-rates/helpers/prepare-interest-rates-historical-response'

if (!process.env.FUNCTIONS_API_URL) {
  throw new Error('FUNCTIONS_API_URL is not set')
}

/**
 * Retrieves interest rates data for Arks on the specified network.
 *
 * This function fetches interest rates for a list of Arks, supporting both
 * latest rates (via batch API) and historical rates (via individual API calls).
 * It automatically filters out Arks with zero capacity and handles fallback
 * scenarios when the batch API fails.
 *
 * @param {Object} params - The parameters for fetching interest rates
 * @param {SupportedSDKNetworks} params.network - The blockchain network to query (e.g., Mainnet, Base, ArbitrumOne)
 * @param {Array} params.arksList - Array of Ark vault objects to fetch rates for
 * @param {boolean} [params.justLatestRates=false] - If true, only fetches latest rates via batch API with fallback to individual calls
 *
 * @returns {Promise<InterestRates>} A promise that resolves to an object mapping Ark names to their interest rate data
 *
 * @throws {Error} When FUNCTIONS_API_URL environment variable is not set
 * @throws {Error} When the specified network is not supported for interest rates
 * @throws {Error} When batch API request fails and fallback also fails
 *
 * @example
 * ```typescript
 * const rates = await getArksInterestRates({
 *   network: SupportedSDKNetworks.Mainnet,
 *   arksList: vaultArks,
 *   justLatestRates: true
 * });
 * ```
 */
export async function getArksInterestRates({
  network,
  arksList,
  justLatestRates = false,
}: GetInterestRatesParams): Promise<InterestRates> {
  if (!isProperInterestRatesNetwork(network)) {
    throw new Error(`getInterestRates: No endpoint found for network: ${network}`)
  }

  const filteredArksWithCapHigherThanZero = arksList.filter(filterArksWithCapHigherThanZero)

  const arkNamesList = filteredArksWithCapHigherThanZero.map(mapArkName)

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
      const latestRatesResponse = await fetch(getArkRatesBatchUrl({ apiUrl: functionsApiUrl }), {
        method: 'POST',
        body: JSON.stringify({ productIds }),
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!latestRatesResponse.ok) {
        // eslint-disable-next-line no-console
        console.warn('Batch API request failed with status:', latestRatesResponse.status)

        throw new Error('Batch API request failed')
      }

      const data = await latestRatesResponse.json()

      // Validate the response data
      if (!data.interestRates) {
        // eslint-disable-next-line no-console
        console.warn('Invalid batch response format:', data)

        throw new Error('Invalid batch response format')
      }

      // Return early with the batch response
      return prepareInterestRatesDataResponse({
        arkNamesList,
        interestRatesMap: filteredArksWithCapHigherThanZero.map(
          mapLatestInterestRatesResponse(data),
        ),
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Batch request failed, falling back to individual requests:', error)
      // Fall back to individual requests
      const fallbackResponse = await Promise.all(
        filteredArksWithCapHigherThanZero.map(
          prepareInterestRatesFallbackCalls({
            network,
            functionsApiUrl,
          }),
        ),
      )

      return prepareInterestRatesDataResponse({
        arkNamesList,
        interestRatesMap: fallbackResponse,
      })
    }
  } // end latest rates

  // Proceed with existing historical rates logic
  const historicalResponse = await Promise.all(
    filteredArksWithCapHigherThanZero.map(
      prepareInterestRatesHistoricalResponse({
        network,
        functionsApiUrl,
      }),
    ),
  )

  return prepareInterestRatesDataResponse({
    arkNamesList,
    interestRatesMap: historicalResponse,
  })
}
