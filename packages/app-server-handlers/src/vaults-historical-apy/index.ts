import {
  type AggregatedFleetRate,
  type FleetRate,
  type HistoricalFleetRateResult,
} from '@summerfi/app-types'

type GetVaultsHistoricalApyParams = {
  fleets: {
    fleetAddress: string
    chainId: number
  }[]
}

type GetVaultsHistoricalApyRAWResponse = {
  rates: HistoricalFleetRateResult[]
}

type RatesParsed = {
  averageRate: string
  date: number
}

export type GetVaultsHistoricalApyResponse = {
  // key is `${fleetAddress}-${chainId}`
  [key: `${string}-${string}`]: {
    hourlyInterestRates: RatesParsed[]
    dailyInterestRates: RatesParsed[]
    weeklyInterestRates: RatesParsed[]
    latestInterestRate: RatesParsed[]
  }
}

const mapRates = ({ averageRate, date }: AggregatedFleetRate) => ({
  averageRate,
  date: Number(date),
})

const mapLatestRate = ({ rate, timestamp }: FleetRate) => ({
  averageRate: rate,
  date: Number(timestamp),
})

const getEmptyResponse = (fleets: GetVaultsHistoricalApyParams['fleets']) => {
  const emptyResponse: GetVaultsHistoricalApyResponse = {}

  for (const { fleetAddress, chainId } of fleets) {
    emptyResponse[`${fleetAddress}-${chainId}`] = {
      hourlyInterestRates: [],
      dailyInterestRates: [],
      weeklyInterestRates: [],
      latestInterestRate: [],
    }
  }

  return emptyResponse
}

/**
 * Retrieves historical APY (Annual Percentage Yield) rates for the specified vault fleets.
 *
 * This function sends a POST request to the configured FUNCTIONS_API_URL endpoint to fetch
 * hourly, daily, weekly, and latest interest rates for each fleet and chain combination.
 *
 * @param params - The parameters for fetching historical APY rates.
 * @param params.fleets - An array of objects, each containing a `fleetAddress` and `chainId`
 *   identifying the vault fleet and its blockchain network.
 *
 * @returns A promise that resolves to an object where each key is a string in the format
 *   `${fleetAddress}-${chainId}` and the value contains arrays of parsed interest rates
 *   (hourly, daily, weekly, and latest) for that fleet.
 *
 * @throws Will throw an error if the FUNCTIONS_API_URL environment variable is not set,
 *   or if the fetch request fails.
 */
export const getVaultsHistoricalApy: ({
  fleets,
}: GetVaultsHistoricalApyParams) => Promise<GetVaultsHistoricalApyResponse> = async ({
  fleets,
}) => {
  const functionsApiUrl = process.env.FUNCTIONS_API_URL
  const emptyResponse = getEmptyResponse(fleets)

  if (!functionsApiUrl) {
    throw new Error('FUNCTIONS_API_URL is not set')
  }

  try {
    const apiResponse = await fetch(`${functionsApiUrl}/api/vault/historicalRates`, {
      method: 'POST',
      body: JSON.stringify({ fleets }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const rawResponse: GetVaultsHistoricalApyRAWResponse = await apiResponse.json()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!rawResponse.rates) {
      return emptyResponse
    }

    const response: GetVaultsHistoricalApyResponse = {}

    for (const { rates, fleetAddress, chainId } of rawResponse.rates) {
      response[`${fleetAddress}-${chainId}`] = {
        hourlyInterestRates: rates.hourlyRates.map(mapRates),
        dailyInterestRates: rates.dailyRates.map(mapRates),
        weeklyInterestRates: rates.weeklyRates.map(mapRates),
        latestInterestRate: rates.latestRate.map(mapLatestRate),
      }
    }

    return response
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getVaultsHistoricalApy: Error parsing historical rates', error)

    throw error
  }
}
