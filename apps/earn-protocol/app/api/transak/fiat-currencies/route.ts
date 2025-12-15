import { type NextRequest, NextResponse } from 'next/server'

import { CACHE_TIMES } from '@/constants/revalidation'
import { getTransakUrl } from '@/features/transak/helpers/get-transak-url'
import { type TransakFiatCurrenciesResponse } from '@/features/transak/types'

interface ExtendedHeaders extends Headers {
  'x-partner-api-key'?: string
}

interface ExtendedApiRequest extends NextRequest {
  headers: ExtendedHeaders
}

export async function GET(req: ExtendedApiRequest) {
  const transakApiUrl = getTransakUrl()
  const partnerApiKey = req.headers.get('x-partner-api-key')

  if (!partnerApiKey) {
    return NextResponse.json({ error: 'Partner key not provided' }, { status: 400 })
  }

  const requestUrl = `${transakApiUrl}/api/v2/currencies/fiat-currencies?apiKey=${partnerApiKey}`

  try {
    const data = await fetch(requestUrl, {
      method: 'GET',
      headers: { accept: 'application/json' },
      next: {
        revalidate: CACHE_TIMES.ALWAYS_FRESH,
      },
    })

    if (!data.ok) {
      throw new Error(`Fiat currencies API returned ${data.status}`)
    }
    const fiatCurrenciesResponse: TransakFiatCurrenciesResponse = await data.json()

    const sanitizedData = fiatCurrenciesResponse.response
      .filter((item) => item.isAllowed)
      .map((item) => ({
        icon: item.icon,
        name: item.name,
        symbol: item.symbol,
        isPopular: item.isPopular,
        supportingCountries: item.supportingCountries,
        paymentOptions: item.paymentOptions
          .filter((option) => option.isActive)
          .map((option) => ({
            name: option.name,
            id: option.id,
            icon: option.icon,
            minAmount: option.minAmount,
            maxAmount: option.maxAmount,
            processingTime: option.processingTime,
          })),
      }))

    return NextResponse.json({ response: sanitizedData })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Fiat currencies request failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Fiat currencies request failed',
        },
      },
      { status: 500 },
    )
  }
}
