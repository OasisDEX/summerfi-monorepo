'use server'

import { type GetInterestRatesParams } from '@summerfi/app-types'
import { getArkProductId, getArkRatesBatchUrl } from '@summerfi/app-utils'

import {
  filterArksWithCapHigherThanZero,
  interestRatesMapArkName,
  isProperInterestRatesNetwork,
  mapLatestInterestRatesResponse,
  prepareInterestRatesDataResponse,
  prepareInterestRatesFallbackCalls,
  prepareInterestRatesHistoricalResponse,
} from '@/app/server-handlers/interest-rates/helpers'

if (!process.env.FUNCTIONS_API_URL) {
  throw new Error('FUNCTIONS_API_URL is not set')
}

// CAUTION - IF SOMETHING IS UPDATED HERE UPDATE IT ALSO IN EARN LANDING APP
export async function getInterestRates({
  network,
  arksList,
  justLatestRates = false,
}: GetInterestRatesParams) {
  if (!isProperInterestRatesNetwork(network)) {
    throw new Error(`getInterestRates: No endpoint found for network: ${network}`)
  }

  const filteredArksWithCapHigherThanZero = arksList.filter(filterArksWithCapHigherThanZero)

  const arkNamesList = filteredArksWithCapHigherThanZero.map(interestRatesMapArkName)
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
        next: {
          revalidate: 0,
        },
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

export type GetInterestRatesReturnType = Awaited<ReturnType<typeof getInterestRates>>
