import { getArkProductId } from '@summerfi/app-utils'
import { type GetInterestRatesQuery } from '@summerfi/summer-earn-rates-subgraph'

import { noInterestRates } from '@/arks-interest-rates/constants'
import { type ArkType } from '@/arks-interest-rates/types'

/**
 * Maps batch API response data to individual Ark interest rates format.
 *
 * This function transforms the batch API response into the standard
 * GetInterestRatesQuery format for each Ark. It extracts the latest
 * interest rate for a specific Ark using its product ID, and returns
 * default no-interest-rates data if no rates are found.
 *
 * @param {Object} data - The batch API response containing interest rates for multiple products
 * @param {Object} data.interestRates - Object mapping product IDs to their rate arrays
 * @returns {Function} A function that takes an Ark and returns its interest rates data
 *
 * @example
 * ```typescript
 * const mapper = mapLatestInterestRatesResponse(batchData);
 * const arkRates = mapper(arkObject);
 * ```
 */
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
