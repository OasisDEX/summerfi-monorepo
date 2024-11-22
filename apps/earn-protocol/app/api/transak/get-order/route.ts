import { type NextRequest, NextResponse } from 'next/server'

import { getTransakUrl } from '@/features/transak/helpers/get-transak-url'

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json({ error: 'Order id not provided' }, { status: 500 })
  }

  const transakApiUrl = getTransakUrl()
  const requestUrl = `${transakApiUrl}/partners/api/v2/order/${orderId}`

  const accessToken = req.cookies.get(`transak-access-token`)

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'access-token': accessToken.value },
  }

  const response = await fetch(requestUrl, options)

  return NextResponse.json(await response.json())
}
