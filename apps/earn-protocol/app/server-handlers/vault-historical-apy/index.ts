export type GetVaultsHistoricalApyParams = {
  fleets: {
    fleetAddress: string
    chainId: number
  }[]
}

type RatesRaw = {
  id: string
  averageRate: string
  date: string
  fleetAddress: string
}

type LatestRateRaw = {
  id: string
  rate: string
  timestamp: string
  fleetAddress: string
}

type GetVaultsHistoricalApyRAWResponse = {
  rates: {
    chainId: number
    fleetAddress: string
    rates: {
      dailyRates: RatesRaw[]
      hourlyRates: RatesRaw[]
      weeklyRates: RatesRaw[]
      latestRate: LatestRateRaw[]
    }
  }[]
}

type RatesParsed = {
  averageRate: string
  date: number
}

export type GetVaultsHistoricalApyResponse = {
  // key is `${fleetAddress}-${chainId}`
  [key: `${string}-${number}`]: {
    hourlyInterestRates: RatesParsed[]
    dailyInterestRates: RatesParsed[]
    weeklyInterestRates: RatesParsed[]
    latestInterestRate: RatesParsed[]
  }
}

const mapRates = ({ averageRate, date }: RatesRaw) => ({
  averageRate,
  date: Number(date),
})

const mapLatestRate = ({ rate, timestamp }: LatestRateRaw) => ({
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
      cache: 'no-store',
      next: {
        revalidate: 0,
      },
    })

    let rawResponse: GetVaultsHistoricalApyRAWResponse | null =
      (await apiResponse.json()) as GetVaultsHistoricalApyRAWResponse

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

    // Clear the reference to rawResponse after processing
    rawResponse = null

    return response
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getVaultsHistoricalApy: Error parsing historical rates', error)

    throw error
  }
}
