import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getLandingPageSumrStakingV2UserData } from '@/app/server-handlers/raw-calls/sumr-staking-v2'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'

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
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  try {
    const userInfo = await unstableCache(
      getLandingPageSumrStakingV2UserData,
      ['landingPageSumrStakingV2UserData', walletAddress.toLowerCase()],
      {
        revalidate: 300, // 5 minutes
        tags: [getUserDataCacheHandler(walletAddress)],
      },
    )({
      walletAddress,
      sumrPriceUsd,
    })

    return NextResponse.json({ userInfo })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in staking-v2 user-info route:', error)

    return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 })
  }
}
