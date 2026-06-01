import { type NextRequest, NextResponse } from 'next/server'

import { CACHE_TIMES } from '@/constants/revalidation'

// Rewrite the path to remove the /api/sdk/ prefix
// This is necessary to use sdkApiUrl correctly
// For example, /api/sdk/some/action will become /some/action
function rewriteSdkPath(pathname: string): string {
  return pathname.replace('/api/sdk/', '/')
}

export async function POST(req: NextRequest) {
  const sdkApiUrl = `${process.env.SDK_API_URL}/sdk/trpc`
  const body = await req.json()

  if (!sdkApiUrl) {
    return NextResponse.json({ error: 'SDK_API_URL is not set' }, { status: 500 })
  }

  const rewrittenPath = rewriteSdkPath(req.nextUrl.pathname)
  const url = sdkApiUrl + rewrittenPath + req.nextUrl.search

  const clientId = req.headers.get('client-id')
  const instiVersion = req.headers.get('insti-version')
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  if (clientId) {
    headers['Client-Id'] = clientId
  }

  // Forward the institutional deployment-config version so RWA (institutional) calls resolve
  // the right deployment/subgraph; the SDK server defaults to 'v1' when it is absent.
  if (instiVersion) {
    headers['Insti-Version'] = instiVersion
  }

  const response = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
    next: {
      revalidate: CACHE_TIMES.ALWAYS_FRESH,
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

  const rewrittenPath = rewriteSdkPath(req.nextUrl.pathname)
  const url = sdkApiUrl + rewrittenPath + req.nextUrl.search

  const clientId = req.headers.get('client-id')
  const instiVersion = req.headers.get('insti-version')
  const headers: { [key: string]: string } = {}

  if (clientId) {
    headers['Client-Id'] = clientId
  }

  // Forward the institutional deployment-config version so RWA (institutional) calls resolve
  // the right deployment/subgraph; the SDK server defaults to 'v1' when it is absent.
  if (instiVersion) {
    headers['Insti-Version'] = instiVersion
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate: CACHE_TIMES.ALWAYS_FRESH,
    },
  })

  return NextResponse.json(await response.json())
}
