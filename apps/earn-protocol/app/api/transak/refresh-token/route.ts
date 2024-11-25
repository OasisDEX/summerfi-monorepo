import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { type NextRequest, NextResponse } from 'next/server'

import { getTransakUrl } from '@/features/transak/helpers/get-transak-url'
import { type TransakRefreshTokenResponse } from '@/features/transak/types'

interface ExtendedHeaders extends Headers {
  'x-partner-api-key'?: string
}

interface ExtendedApiRequest extends NextRequest {
  headers: ExtendedHeaders
}

export async function GET(req: ExtendedApiRequest) {
  const transakApiUrl = getTransakUrl()
  const requestUrl = `${transakApiUrl}/partners/api/v2/refresh-token`
  const partnerApiKey = req.headers.get('x-partner-api-key')

  if (!partnerApiKey) {
    return NextResponse.json({ error: 'Partner key not provided' }, { status: 500 })
  }
  const transakSecret = process.env.TRANSAK_SECRET

  if (!transakSecret) {
    return NextResponse.json({ error: 'ENV variable is not set' }, { status: 500 })
  }

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-secret': transakSecret,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ apiKey: partnerApiKey }),
  }

  const data = await fetch(requestUrl, options)

  const tokenResponse: TransakRefreshTokenResponse = await data.json()

  const response = NextResponse.json({ success: true })

  const commonPayload: ResponseCookie = {
    name: `transak-access-token`,
    value: tokenResponse.data.accessToken,
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: true,
    path: '/',
  }

  response.cookies.set(commonPayload)

  return response
}
