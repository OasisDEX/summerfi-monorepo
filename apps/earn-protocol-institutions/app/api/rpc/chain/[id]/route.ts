import { SupportedNetworkIds } from '@summerfi/app-types'

import { INSTITUTIONS_CACHE_TIMES } from '@/constants/revalidation'

const rpcUrlMap: {
  [key in SupportedNetworkIds]: string
} = {
  1: 'https://eth-mainnet.g.alchemy.com/v2',
  42161: 'https://arb-mainnet.g.alchemy.com/v2',
  8453: 'https://base-mainnet.g.alchemy.com/v2',
  146: 'https://sonic-mainnet.g.alchemy.com/v2',
  999: 'https://hyperliquid-mainnet.g.alchemy.com/v2',
}

export async function POST(req: Request) {
  const id = Number(req.url.split('/').pop())

  if (!id || !Object.values(SupportedNetworkIds).includes(id as SupportedNetworkIds)) {
    return new Response('Invalid network ID', {
      status: 400,
    })
  }

  const rpcUrl = rpcUrlMap[id as SupportedNetworkIds]

  if (!rpcUrl) {
    return new Response('Unsupported network ID', {
      status: 400,
    })
  }

  const apiKey = process.env.ACCOUNT_KIT_API_KEY

  if (!apiKey) {
    return new Response('ACCOUNT_KIT_API_KEY is not set', {
      status: 500,
    })
  }

  const body = await req.json()

  try {
    const apiResponse = await fetch(`${rpcUrl}/${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      next: {
        revalidate: INSTITUTIONS_CACHE_TIMES.ALWAYS_FRESH,
      },
    })

    if (!apiResponse.ok) {
      const errorResult = await apiResponse
        .json()
        .catch(() => ({ message: 'Failed to fetch data' }))

      return Response.json(errorResult)
    }

    const result = await apiResponse.json()

    return Response.json(result)
  } catch (error) {
    return new Response('Server error occurred', {
      status: 500,
    })
  }
}
