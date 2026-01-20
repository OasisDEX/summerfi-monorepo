import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import {
  getServerSideCookies,
  parseServerResponseToClient,
  safeParseJson,
} from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { cookies } from 'next/headers'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { SumrV2StakingManageView } from '@/components/layout/SumrV2StakingManageView/SumrV2StakingManageView'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'

const SumrStakingManagePage = async () => {
  const [configRaw, cookieRaw, sumrPrice, config] = await Promise.all([
    getCachedConfig(),
    cookies(),
    getCachedSumrPrice(),
    getCachedConfig(),
  ])
  const systemConfig = parseServerResponseToClient(configRaw)

  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))

  const sumrPriceUsd = getEstimatedSumrPrice({
    config,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  return systemConfig.features?.StakingV2 ? (
    <SumrV2StakingManageView sumrPriceUsd={sumrPriceUsd} />
  ) : null
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - $SUMR Staking`,
    description:
      'Stake your $SUMR tokens and earn rewards with Summer Protocol. Enjoy flexible staking options and maximize your returns in the Summer ecosystem.',
  }
}

export default SumrStakingManagePage
