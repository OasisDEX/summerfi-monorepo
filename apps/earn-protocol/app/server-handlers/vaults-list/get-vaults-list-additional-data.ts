import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import {
  getServerSideCookies,
  parseServerResponseToClient,
  safeParseJson,
} from '@summerfi/app-utils'
import { cookies } from 'next/headers'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedTvl } from '@/app/server-handlers/cached/get-tvl'
import { getCachedVaultsStats } from '@/app/server-handlers/cached/get-vaults-stats'
import { getCachedRewardTokenPrice } from '@/app/server-handlers/reward-token-price'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'

// Tab/wallet-independent data shared by the /api/vaults-list-additional-data route and the
// server-side prefetch in the page.
export const getVaultsListAdditionalData = async () => {
  const [cookieRaw, configRaw, rewardTokenPrices, tvl, { instantLiquidity, protocolsList }] =
    await Promise.all([
      cookies(),
      getCachedConfig(),
      getCachedRewardTokenPrice(),
      getCachedTvl(),
      getCachedVaultsStats(),
    ])

  const systemConfig = parseServerResponseToClient(configRaw)
  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))

  const sumrPriceUsd = getEstimatedSumrPrice({
    config: systemConfig,
    sumrPrice: rewardTokenPrices.SUMR,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  return {
    sumrPriceUsd,
    rewardTokenPrices,
    tvl,
    instantLiquidity,
    protocolsList,
  }
}
