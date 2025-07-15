import { REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { type NextRequest, NextResponse } from 'next/server'

import { getRpcGatewayUrl } from '@/helpers/rpc-gateway'

/**
 * Handles RPC requests.
 * @param req - The Next.js API request object.
 * @returns The resolved response from the RPC gateway.
 */
export async function POST(req: NextRequest) {
  const networkQuery = req.nextUrl.searchParams.get('network')

  if (!networkQuery) {
    return NextResponse.json({ error: 'Missing network query' }, { status: 400 })
  }

  const networkName = networkQuery.toString() as NetworkNames
  const rpcGatewayUrl = await getRpcGatewayUrl(networkName)

  if (!rpcGatewayUrl) {
    return NextResponse.json({ error: 'Invalid network or RPC Config is missing' }, { status: 400 })
  }
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive',
      'Content-Length': '',
    },
  }

  const body = JSON.stringify(await req.json())

  const request = new Request(rpcGatewayUrl, {
    method: req.method,
    body,
    headers: {
      ...config.headers,
      'Content-Length': body.length.toString(),
    },
  })

  try {
    const response = await fetch(request, {
      cache: 'no-store',
      next: {
        revalidate: REVALIDATION_TIMES.ALWAYS_FRESH,
      },
    })

    if (response.status !== 200) {
      return NextResponse.json({ error: response.statusText }, { status: response.status })
    }
    const resolvedResponse = await response.json()

    return NextResponse.json(resolvedResponse, { status: 200 })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('RPC Gateway Error', e)

    return NextResponse.json({ error: 'RPC Gateway Error' }, { status: 500 })
  }
}
