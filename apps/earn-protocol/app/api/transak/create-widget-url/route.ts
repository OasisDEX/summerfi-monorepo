import { type NextRequest, NextResponse } from 'next/server'

import { CACHE_TIMES } from '@/constants/revalidation'
import { transakPublicApiKey } from '@/features/transak/consts'
import { getTransakGatewayUrl } from '@/features/transak/helpers/get-transak-gateway-url'
import { type TransakCreateWidgetUrlResponse } from '@/features/transak/types'

type CreateWidgetUrlBody = {
  widgetParams: { [key: string]: unknown }
  referrerDomain?: string
}

const sanitizeWidgetParams = (input: { [key: string]: unknown }) => {
  // crude, but effective
  const sanitized: { [key: string]: unknown } = {}

  if (typeof input.walletAddress === 'string') {
    sanitized.walletAddress = input.walletAddress
  }

  if (typeof input.disableWalletAddressForm === 'boolean') {
    sanitized.disableWalletAddressForm = input.disableWalletAddressForm
  }

  if (typeof input.hideExchangeScreen === 'boolean') {
    sanitized.hideExchangeScreen = input.hideExchangeScreen
  }

  if (typeof input.network === 'string') {
    sanitized.network = input.network
  }

  if (typeof input.email === 'string') {
    sanitized.email = input.email
  }

  if (typeof input.fiatAmount === 'number') {
    sanitized.fiatAmount = input.fiatAmount
  }

  if (typeof input.fiatCurrency === 'string') {
    sanitized.fiatCurrency = input.fiatCurrency
  }

  if (typeof input.paymentMethod === 'string') {
    sanitized.paymentMethod = input.paymentMethod
  }

  if (typeof input.cryptoCurrencyCode === 'string') {
    sanitized.cryptoCurrencyCode = input.cryptoCurrencyCode
  }

  if (typeof input.productsAvailed === 'string') {
    sanitized.productsAvailed = input.productsAvailed
  }

  return sanitized
}

export async function POST(req: NextRequest) {
  if (!transakPublicApiKey) {
    return NextResponse.json({ error: 'ENV variable is not set' }, { status: 400 })
  }

  const accessToken = req.cookies.get('transak-access-token')

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  let body: CreateWidgetUrlBody

  try {
    body = (await req.json()) as CreateWidgetUrlBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const originHeader = req.headers.get('origin')
  const referer = req.headers.get('referer')
  let referrerFromHeader = originHeader ?? undefined

  if (!referrerFromHeader && referer) {
    try {
      referrerFromHeader = new URL(referer).origin
    } catch {
      referrerFromHeader = undefined
    }
  }
  const referrerDomain = body.referrerDomain ?? referrerFromHeader

  if (!referrerDomain) {
    return NextResponse.json({ error: 'Missing referrer domain' }, { status: 400 })
  }

  const widgetParams = {
    ...sanitizeWidgetParams(body.widgetParams),
    apiKey: transakPublicApiKey,
    referrerDomain,
  }

  const requestUrl = `${getTransakGatewayUrl()}/api/v2/auth/session`

  try {
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'access-token': accessToken.value,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ widgetParams }),
      next: {
        revalidate: CACHE_TIMES.ALWAYS_FRESH,
      },
    })

    if (!response.ok) {
      throw new Error(`Create widget URL API returned ${response.status}`)
    }

    const data: TransakCreateWidgetUrlResponse = await response.json()

    return NextResponse.json({ widgetUrl: data.data.widgetUrl })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Create widget URL request failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Create widget URL request failed',
        },
      },
      { status: 500 },
    )
  }
}
