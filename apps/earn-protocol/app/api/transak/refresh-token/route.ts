import { type NextRequest, NextResponse } from 'next/server'

import { getTransakUrl } from '@/features/transak/helpers/get-transak-url'

export async function GET(req: NextRequest) {
  const transakApiUrl = getTransakUrl()
  const requestUrl = `${transakApiUrl}/partners/api/v2/refresh-token`
  const partnerApiKey = req.nextUrl.searchParams.get('partnerApiKey')

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

  const response = await fetch(requestUrl, options)

  return NextResponse.json(await response.json())
}
