import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'

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
  //   '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17-42161': 8.002220099969366,
  //   '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17-8453': 13.54019480114041,
  //   '0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d-1': 6.578848760141222,
  //   '0x67e536797570b3d8919df052484273815a0ab506-1': 2.7373712017127283,
  //   '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17-1': 8.890826768108603
  // }
  // apy gets divided by 100 to not confuse the frontend
  [key: `${string}-${number}`]: number
}

export const getVaultsApy: ({
  fleets,
}: GetVaultsApyParams) => Promise<GetVaultsApyResponse> = async ({ fleets }) => {
  const functionsApiUrl = process.env.FUNCTIONS_API_URL

  if (!functionsApiUrl) {
    throw new Error('FUNCTIONS_API_URL is not set')
  }

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

  const response = rawResponse.rates.reduce<GetVaultsApyResponse>((topAcc, { rates, chainId }) => {
    const ratesMap = rates.reduce<{ [key: string]: number }>((acc, { rate, fleetAddress }) => {
      acc[`${fleetAddress}-${chainId}`] = Number(rate) / 100

      return acc
    }, {})

    return {
      ...topAcc,
      ...ratesMap,
    }
  }, {})

  return response
}
