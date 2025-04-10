import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type VaultApyData } from '@summerfi/app-types'

export type GetVaultsApyParams = {
  fleets: {
    fleetAddress: string
    chainId: number
  }[]
}

type GetVaultsApyRAWResponse = {
  rates: {
    chainId: number
    fleetAddress: string
    sma: {
      sma24h: string | null
      sma7d: string | null
      sma30d: string | null
    }
    rates: [
      {
        id: string
        rate: string
        timestamp: number
        fleetAddress: string
      },
    ]
  }[]
}

export type GetVaultsApyResponse = {
  // response {
  //   '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17-42161': {
  //     apy: 8.002220099969366,
  //     sma24h: 13.54019480114041,
  //     sma7d: 6.578848760141222,
  //     sma30d: 2.7373712017127283,
  //   },
  //   '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17-8453': {
  //     apy: 13.54019480114041,
  //     sma24h: 13.54019480114041,
  //     sma7d: 6.578848760141222,
  //     sma30d: 2.7373712017127283,
  //   },
  // } etc
  // apy gets divided by 100 to not confuse the frontend
  [key: `${string}-${number}`]: VaultApyData
}

export const getVaultsApy: ({
  fleets,
}: GetVaultsApyParams) => Promise<GetVaultsApyResponse> = async ({ fleets }) => {
  const functionsApiUrl = process.env.FUNCTIONS_API_URL

  const emptyResponse = fleets.reduce<GetVaultsApyResponse>((acc, { fleetAddress, chainId }) => {
    acc[`${fleetAddress}-${chainId}`] = {
      apy: 0,
      apyTimestamp: null,
      sma24h: null,
      sma7d: null,
      sma30d: null,
    }

    return acc
  }, {})

  if (!functionsApiUrl) {
    throw new Error('FUNCTIONS_API_URL is not set')
  }

  try {
    const apiResponse = await fetch(`${functionsApiUrl}/api/vault/rates`, {
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

    const rawResponse = (await apiResponse.json()) as GetVaultsApyRAWResponse

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!rawResponse.rates) {
      return emptyResponse
    }

    const response = rawResponse.rates.reduce<GetVaultsApyResponse>(
      (topAcc, { rates, chainId, sma }) => {
        const ratesMap = rates.reduce<{
          [key: string]: VaultApyData
        }>((acc, { rate, fleetAddress }) => {
          acc[`${fleetAddress}-${chainId}`] = {
            apy: Number(rate) / 100,
            apyTimestamp: rates[0].timestamp,
            sma24h: sma.sma24h ? Number(sma.sma24h) / 100 : null,
            sma7d: sma.sma7d ? Number(sma.sma7d) / 100 : null,
            sma30d: sma.sma30d ? Number(sma.sma30d) / 100 : null,
          }

          return acc
        }, {})

        return {
          ...topAcc,
          ...ratesMap,
        }
      },
      emptyResponse,
    )

    return response
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getVaultsApy: Error parsing vaults apy', error)

    throw error
  }
}
