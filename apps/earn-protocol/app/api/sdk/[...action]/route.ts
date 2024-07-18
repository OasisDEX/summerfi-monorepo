import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const sdkApiUrl = process.env.SDK_API_URL

  if (!sdkApiUrl) {
    return NextResponse.json({ error: 'SDK_API_URL is not set' }, { status: 500 })
  }

  const url = sdkApiUrl + req.nextUrl.pathname
  const headers = {}
  const response = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(await req.json()),
  })

  return NextResponse.json(await response.json())
}

export async function GET(req: NextRequest) {
  const sdkApiUrl = process.env.SDK_API_URL

  if (!sdkApiUrl) {
    return NextResponse.json({ error: 'SDK_API_URL is not set' }, { status: 500 })
  }

  const url = sdkApiUrl + req.nextUrl.pathname

  const headers = {}
  const response = await fetch(url, { headers })

  return NextResponse.json(await response.json())
}
