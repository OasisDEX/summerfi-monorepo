import { type GetVaultsApyResponse } from '@summerfi/app-types'

type GetVaultsApyParams = {
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

const getEmptyResponse = (fleets: GetVaultsApyParams['fleets']) => {
  const emptyResponse: GetVaultsApyResponse = {}

  for (const { fleetAddress, chainId } of fleets) {
    emptyResponse[`${fleetAddress}-${chainId}`] = {
      apy: 0,
      apyTimestamp: null,
      sma24h: null,
      sma7d: null,
      sma30d: null,
    }
  }

  return emptyResponse
}

export const getVaultsApy: ({
  fleets,
}: GetVaultsApyParams) => Promise<GetVaultsApyResponse> = async ({ fleets }) => {
  const functionsApiUrl = process.env.FUNCTIONS_API_URL

  const emptyResponse = getEmptyResponse(fleets)

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
        revalidate: 0,
      },
    })

    let rawResponse: GetVaultsApyRAWResponse | null =
      (await apiResponse.json()) as GetVaultsApyRAWResponse

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!rawResponse.rates) {
      return emptyResponse
    }

    const response: GetVaultsApyResponse = { ...emptyResponse }

    for (const { rates, chainId, sma } of rawResponse.rates) {
      for (const { rate, fleetAddress, timestamp } of rates) {
        response[`${fleetAddress}-${chainId}`] = {
          apy: Number(rate) / 100,
          apyTimestamp: timestamp,
          sma24h: sma.sma24h ? Number(sma.sma24h) / 100 : null,
          sma7d: sma.sma7d ? Number(sma.sma7d) / 100 : null,
          sma30d: sma.sma30d ? Number(sma.sma30d) / 100 : null,
        }
      }
    }

    // Clear the reference to rawResponse after processing
    rawResponse = null

    return response
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getVaultsApy: Error parsing vaults apy', error)

    throw error
  }
}
