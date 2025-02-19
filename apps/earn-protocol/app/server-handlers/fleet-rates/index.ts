'use server'

import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type ChainId } from '@summerfi/sdk-common'

interface FleetWithChainId {
  chainId: ChainId
  address: string
}

export interface VaultRate {
  id: string
  rate: string
  timestamp: number
  fleetAddress: string
}

export interface AggregatedFleetRate {
  id: string
  averageRate: string
  date: string
  fleetAddress: string
}

export interface FleetRate {
  id: string
  rate: string
  timestamp: number
  fleetAddress: string
}
export interface FleetRateResult {
  chainId: string
  fleetAddress: string
  rates: FleetRate[]
}

export interface HistoricalFleetRates {
  dailyRates: AggregatedFleetRate[]
  hourlyRates: AggregatedFleetRate[]
  weeklyRates: AggregatedFleetRate[]
  latestRate: VaultRate[]
}

export interface HistoricalFleetRateResult {
  chainId: string
  fleetAddress: string
  rates: HistoricalFleetRates
}

const noRates = {
  rates: [] as VaultRate[],
}

if (!process.env.FUNCTIONS_API_URL) {
  throw new Error('FUNCTIONS_API_URL is not set')
}

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

export async function getFleetRates({
  fleetsWithChainId,
  historical = false,
}: {
  fleetsWithChainId: FleetWithChainId[]
  historical?: boolean
}) {
  const functionsApiUrl = process.env.FUNCTIONS_API_URL
  const fleets = fleetsWithChainId
  console.log('getting fleet rates')
  if (!functionsApiUrl) {
    throw new Error('FUNCTIONS_API_URL is not set')
  }

  // Transform fleets to the expected format

  try {
    const endpoint = historical ? '/vault/historicalRates' : '/vault/rates'
    const apiResponse = await customFetchCache(`${functionsApiUrl}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify({ fleets }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!apiResponse.ok) {
      // eslint-disable-next-line no-console
      console.warn('Fleet rates API request failed with status:', apiResponse.status)

      throw new Error('Fleet rates API request failed')
    }

    const data = await apiResponse.json()

    if (historical) {
      // Handle historical rates response
      const historicalData = data.rates as HistoricalFleetRateResult[]
      console.log('historicalData fetched')
      return historicalData
    } else {
      // Handle current rates response
      const currentData = data as FleetRateResult

      return currentData
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching fleet rates:', error)

    // Return empty rates for all fleets in case of error
    return fleets.reduce<{ [key: string]: typeof noRates }>((acc, fleet) => {
      acc[fleet.address] = noRates

      return acc
    }, {})
  }
}

export type GetFleetRatesReturnType = Awaited<ReturnType<typeof getFleetRates>>
