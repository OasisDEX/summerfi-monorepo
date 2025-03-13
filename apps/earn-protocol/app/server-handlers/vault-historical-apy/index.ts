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

    // const response: GetVaultsHistoricalApyResponse = rawResponse.rates.reduce(
    //   (topAcc, { rates, fleetAddress, chainId }) => {
    //     const calculateSMA24 = (rates: RatesRaw[]) => {
    //       // Sort rates by date to ensure correct order
    //       const sortedRates = [...rates].sort((a, b) => Number(a.date) - Number(b.date))

    //       return sortedRates.map((_, index, array) => {
    //         if (index < 23) {
    //           // Return raw value for the first 23 entries
    //           return {
    //             averageRate: array[index].averageRate,
    //             date: Number(array[index].date),
    //           }
    //         }

    //         // Calculate SMA using previous 24 values (including current)
    //         const window = array.slice(index - 23, index + 1)
    //         const sum = window.reduce((acc, curr) => acc + parseFloat(curr.averageRate), 0)
    //         const sma = sum / 24

    //         return {
    //           averageRate: sma.toString(),
    //           date: Number(array[index].date),
    //         }
    //       })
    //     }

    //     const hourlyInterestRates = calculateSMA24(rates.hourlyRates)
    //     const dailyInterestRates = rates.dailyRates.map(({ averageRate, date }) => {
    //       return {
    //         averageRate,
    //         date: Number(date),
    //       }
    //     })
    //     const weeklyInterestRates = rates.weeklyRates.map(({ averageRate, date }) => {
    //       return {
    //         averageRate,
    //         date: Number(date),
    //       }
    //     })

    //     // Use the last SMA24 value from hourly rates as the latest rate
    //     const latestInterestRate =
    //       hourlyInterestRates.length > 0
    //         ? [hourlyInterestRates[hourlyInterestRates.length - 1]]
    //         : []

    //     return {
    //       ...topAcc,
    //       [`${fleetAddress}-${chainId}`]: {
    //         hourlyInterestRates,
    //         dailyInterestRates,
    //         weeklyInterestRates,
    //         latestInterestRate,
    //       },
    //     }
    //   },
    //   {},
    // )

    const response: GetVaultsHistoricalApyResponse = rawResponse.rates.reduce(
      (topAcc, { rates, fleetAddress, chainId }) => {
        const calculateSMA24 = (rates: RatesRaw[]) => {
          // Sort rates by date to ensure correct order
          const sortedRates = [...rates].sort((a, b) => Number(a.date) - Number(b.date))

          // Kalman Filter parameters
          let estimate = parseFloat(sortedRates[0].averageRate)
          let errorEstimate = 1

          // Tune these parameters to control smoothing:
          const measurementNoise = 0.05 // Higher = more smoothing
          const processNoise = 0.001 // Higher = faster response to changes

          const smoothedRates = sortedRates.map((rate) => {
            // Prediction phase
            const errorPrediction = errorEstimate + processNoise

            // Update phase
            const kalmanGain = errorPrediction / (errorPrediction + measurementNoise)
            estimate = estimate + kalmanGain * (parseFloat(rate.averageRate) - estimate)
            errorEstimate = (1 - kalmanGain) * errorPrediction

            return {
              averageRate: estimate.toString(),
              date: Number(rate.date),
            }
          })

          // Add extra weight to recent values for the latest entries
          const lastIndex = smoothedRates.length - 1
          if (lastIndex >= 2) {
            const recentWeight = 0.5
            const midWeight = 0.3
            const oldWeight = 0.2

            const weightedEstimate =
              parseFloat(smoothedRates[lastIndex].averageRate) * recentWeight +
              parseFloat(smoothedRates[lastIndex - 1].averageRate) * midWeight +
              parseFloat(smoothedRates[lastIndex - 2].averageRate) * oldWeight

            smoothedRates[lastIndex].averageRate = weightedEstimate.toString()
          }

          return smoothedRates
        }

        const hourlyInterestRates = calculateSMA24(rates.hourlyRates)
        const dailyInterestRates = rates.dailyRates.map(({ averageRate, date }) => {
          return {
            averageRate,
            date: Number(date),
          }
        })
        const weeklyInterestRates = rates.weeklyRates.map(({ averageRate, date }) => {
          return {
            averageRate,
            date: Number(date),
          }
        })

        // Use the last SMA24 value from hourly rates as the latest rate
        const latestInterestRate =
          hourlyInterestRates.length > 0
            ? [hourlyInterestRates[hourlyInterestRates.length - 1]]
            : []

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
