import { type NextRequest, NextResponse } from 'next/server'

import { CACHE_TIMES } from '@/constants/revalidation'
import { getTransakUrl } from '@/features/transak/helpers/get-transak-url'

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json(
      { error: 'Missing required parameter: orderId must be provided in the query string' },
      { status: 400 },
    )
  }

  const transakApiUrl = getTransakUrl()
  const requestUrl = `${transakApiUrl}/partners/api/v2/order/${encodeURIComponent(orderId)}`

  const accessToken = req.cookies.get(`transak-access-token`)

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'access-token': accessToken.value,
      },
      next: {
        revalidate: CACHE_TIMES.ALWAYS_FRESH,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch order details' },
        { status: response.status },
      )
    }

    const { data, meta } = await response.json()

    // Sanitize response to only include necessary fields
    const sanitizedData = {
      meta: {
        orderId: meta.orderId,
      },
      data: {
        amount: data.amount,
        cryptocurrency: data.cryptocurrency,
        createdAt: data.createdAt,
        isBuyOrSell: data.isBuyOrSell,
        network: data.network,
        status: data.status,
        walletAddress: data.walletAddress,
        walletLink: data.walletLink,
        cryptoCurrency: data.cryptoCurrency,
        cryptoAmount: data.cryptoAmount,
        fiatCurrency: data.fiatCurrency,
        transactionLink: data.transactionLink,
      },
    }

    return NextResponse.json(sanitizedData)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Transak API error:', error instanceof Error ? error.message : 'Unknown error')

    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
