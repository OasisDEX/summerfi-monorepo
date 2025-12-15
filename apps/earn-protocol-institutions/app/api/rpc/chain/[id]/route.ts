import { SDKChainIdToAAChainMap } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import type { Chain } from 'viem'

import { INSTITUTIONS_CACHE_TIMES } from '@/constants/revalidation'

export async function POST(req: Request) {
  const id = req.url.split('/').pop()
  let chain: Chain

  try {
    chain = SDKChainIdToAAChainMap[parseInt(id as string, 10) as SupportedNetworkIds]
  } catch (error) {
    return new Response(`Chain with id ${id} not found.`, {
      status: 404,
    })
  }

  const [rpcUrl] = chain.rpcUrls.alchemy.http

  const apiKey = process.env.ACCOUNT_KIT_API_KEY

  if (!apiKey) {
    return new Response('ALCHEMY_API_KEY is not set', {
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
