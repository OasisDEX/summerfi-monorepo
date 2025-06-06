import { REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const sdkApiUrl = `${process.env.SDK_API_URL}/sdk/trpc`

  if (!sdkApiUrl) {
    return NextResponse.json({ error: 'SDK_API_URL is not set' }, { status: 500 })
  }

  const url = sdkApiUrl + req.nextUrl.pathname + req.nextUrl.search
  const headers = {}
  const response = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(await req.json()),
    next: {
      revalidate: REVALIDATION_TIMES.ALWAYS_FRESH,
    },
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch data from SDK API' },
      { status: response.status },
    )
  }

  return NextResponse.json(await response.json())
}

export async function GET(req: NextRequest) {
  const sdkApiUrl = `${process.env.SDK_API_URL}/sdk/trpc`

  if (!sdkApiUrl) {
    return NextResponse.json({ error: 'SDK_API_URL is not set' }, { status: 500 })
  }

  const url = sdkApiUrl + req.nextUrl.pathname + req.nextUrl.search

  const headers = {}
  const response = await fetch(url, {
    headers,
    next: {
      revalidate: REVALIDATION_TIMES.ALWAYS_FRESH,
    },
  })

  return NextResponse.json(await response.json())
}
