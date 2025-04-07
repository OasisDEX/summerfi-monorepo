import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'

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

type GetVaultsHistoricalApyRAWResponse = {
  rates: {
    chainId: number
    fleetAddress: string
    rates: {
      dailyRates: RatesRaw[]
      hourlyRates: RatesRaw[]
      weeklyRates: RatesRaw[]
      latestRate: {
        id: string
        rate: string
        timestamp: string
        fleetAddress: string
      }[]
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

export const getVaultsHistoricalApy: ({
  fleets,
}: GetVaultsHistoricalApyParams) => Promise<GetVaultsHistoricalApyResponse> = async ({
  fleets,
}) => {
  const functionsApiUrl = process.env.FUNCTIONS_API_URL
  const emptyResponse = fleets.reduce<GetVaultsHistoricalApyResponse>(
    (acc, { fleetAddress, chainId }) => {
      acc[`${fleetAddress}-${chainId}`] = {
        hourlyInterestRates: [],
        dailyInterestRates: [],
        weeklyInterestRates: [],
        latestInterestRate: [],
      }

      return acc
    },
    {},
  )

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
      next: {
        revalidate: REVALIDATION_TIMES.INTEREST_RATES,
        tags: [REVALIDATION_TAGS.INTEREST_RATES],
      },
    })

    const rawResponse = (await apiResponse.json()) as GetVaultsHistoricalApyRAWResponse

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!rawResponse.rates) {
      return emptyResponse
    }

    const response: GetVaultsHistoricalApyResponse = rawResponse.rates.reduce(
      (topAcc, { rates, fleetAddress, chainId }) => {
        const hourlyInterestRates = rates.hourlyRates.map(({ averageRate, date }) => {
          return {
            averageRate,
            date: Number(date),
          }
        }, {})
        const dailyInterestRates = rates.dailyRates.map(({ averageRate, date }) => {
          return {
            averageRate,
            date: Number(date),
          }
        }, {})
        const weeklyInterestRates = rates.weeklyRates.map(({ averageRate, date }) => {
          return {
            averageRate,
            date: Number(date),
          }
        }, {})

        const latestInterestRate = rates.latestRate.map(({ rate, timestamp }) => {
          return {
            averageRate: rate,
            date: Number(timestamp),
          }
        }, {})

        return {
          ...topAcc,
          [`${fleetAddress}-${chainId}`]: {
            hourlyInterestRates,
            dailyInterestRates,
            weeklyInterestRates,
            latestInterestRate,
          },
        }
      },
      {},
    )

    return response
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getVaultsHistoricalApy: Error parsing historical rates', error)

    throw error
  }
}
