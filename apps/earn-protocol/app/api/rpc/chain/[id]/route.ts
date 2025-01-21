import type { Chain } from 'viem'

import { type AccountKitSupportedNetworks, SDKChainIdToAAChainMap } from '@/account-kit/config'
import { REVALIDATION_TIMES } from '@/constants/revalidations'

export async function POST(req: Request) {
  const id = req.url.split('/').pop()
  let chain: Chain

  try {
    chain = SDKChainIdToAAChainMap[parseInt(id as string, 10) as AccountKitSupportedNetworks]
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
        revalidate: REVALIDATION_TIMES.ALWAYS_FRESH,
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
