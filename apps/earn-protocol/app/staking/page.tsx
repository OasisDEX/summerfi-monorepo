import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import {
  getServerSideCookies,
  parseServerResponseToClient,
  safeParseJson,
} from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { cookies } from 'next/headers'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getLandingPageSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { SumrV2StakingLandingPageView } from '@/components/layout/SumrV2StakingLandingPageView/SumrV2StakingLandingPageView'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'

const SumrStakingLandingPage = async () => {
  const [configRaw, cookieRaw, sumrPrice] = await Promise.all([
    getCachedConfig(),
    cookies(),
    getCachedSumrPrice(),
  ])
  const systemConfig = parseServerResponseToClient(configRaw)

  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const sumrPriceUsd = getEstimatedSumrPrice({
    config: systemConfig,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  if (systemConfig.features?.StakingV2) {
    const [sumrStakingV2LandingPageData] = await Promise.all([
      unstableCache(getLandingPageSumrStakingV2Data, [sumrPriceUsd.toString()], {
        revalidate: CACHE_TIMES.STAKING_V2_GLOBAL_DATA,
        tags: [CACHE_TAGS.STAKING_V2_GLOBAL_DATA],
      })({
        sumrPriceUsd,
      }),
    ])

    return (
      <SumrV2StakingLandingPageView sumrStakingV2LandingPageData={sumrStakingV2LandingPageData} />
    )
  }

  return null
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - $SUMR Staking`,
    description:
      'Stake your $SUMR tokens and earn rewards with Summer Protocol. Enjoy flexible staking options and maximize your returns in the Summer ecosystem.',
  }
}

export default SumrStakingLandingPage
