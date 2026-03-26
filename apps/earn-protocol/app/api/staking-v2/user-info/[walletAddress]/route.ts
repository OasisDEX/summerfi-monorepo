import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedSumrStakingV2UserData } from '@/app/server-handlers/cached/get-sumr-staking-v2-user-data'
import { getCachedSumrPrice } from '@/app/server-handlers/reward-token-price'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const [{ walletAddress }, cookieRaw, sumrPrice, config] = await Promise.all([
    params,
    cookies(),
    getCachedSumrPrice(),
    getCachedConfig(),
  ])
  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const sumrPriceUsd = getEstimatedSumrPrice({
    config,
    sumrPrice: sumrPrice.usd,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  try {
    const userInfo = await getCachedSumrStakingV2UserData({ walletAddress, sumrPriceUsd })

    return NextResponse.json({ userInfo })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in staking-v2 user-info route:', error)

    return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 })
  }
}
