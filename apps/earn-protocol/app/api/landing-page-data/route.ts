import { sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import {
  type EarnAppConfigType,
  type LandingPageData,
  supportedDefillamaProtocols,
  supportedDefillamaProtocolsConfig,
  type SupportedDefillamaTvlProtocols,
} from '@summerfi/app-types'
import {
  getServerSideCookies,
  parseServerResponseToClient,
  safeParseJson,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getCachedMedianDefiProjectYield } from '@/app/server-handlers/cached/defillama/get-median-defi-project-yield'
import { getCachedDefillamaProtocolTvl } from '@/app/server-handlers/cached/defillama/get-protocol-tvl'
import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedTvl } from '@/app/server-handlers/cached/get-tvl'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsInfo } from '@/app/server-handlers/cached/get-vaults-info'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

const emptyTvls = {
  aave: 0n,
  sky: 0n,
  spark: 0n,
  euler: 0n,
  gearbox: 0n,
  compound: 0n,
  ethena: 0n,
  fluid: 0n,
  morpho: 0n,
}

const getProtocolsTvl = async (): Promise<{
  [key in SupportedDefillamaTvlProtocols]: bigint
}> => {
  const protocolTvlsArray = await Promise.all(
    supportedDefillamaProtocols.map((protocol) => {
      return getCachedDefillamaProtocolTvl(
        supportedDefillamaProtocolsConfig[
          protocol as keyof typeof supportedDefillamaProtocolsConfig
        ].defillamaProtocolName,
        protocol,
      )
    }),
  )

  return protocolTvlsArray.reduce<{
    [key in SupportedDefillamaTvlProtocols]: bigint
  }>((acc, curr) => ({ ...acc, ...curr }), emptyTvls)
}

const getProtocolsApy = async (): Promise<{
  [key in SupportedDefillamaTvlProtocols]: [number, number]
}> => {
  const emptyApys = Object.fromEntries(
    supportedDefillamaProtocols.map((protocol) => [protocol, [0, 0]]),
  ) as {
    [key in SupportedDefillamaTvlProtocols]: [number, number]
  }

  const protocolApysArray = await Promise.all(
    supportedDefillamaProtocols.map((protocol) => {
      return getCachedMedianDefiProjectYield({
        project:
          supportedDefillamaProtocolsConfig[
            protocol as keyof typeof supportedDefillamaProtocolsConfig
          ].defillamaProtocolName,
      })
    }),
  )

  const filteredProtocolApysArray = protocolApysArray.filter((apy) => apy[0] !== 0 || apy[1] !== 0)

  return filteredProtocolApysArray.reduce<{
    [key in SupportedDefillamaTvlProtocols]: [number, number]
  }>((acc, curr, index) => {
    const protocol = supportedDefillamaProtocols[index]

    return { ...acc, [protocol]: curr }
  }, emptyApys)
}

export async function GET() {
  const [
    { vaults },
    configRaw,
    rebalanceActivity,
    latestActivity,
    protocolTvls,
    protocolApys,
    vaultsInfoRaw,
    sumrPrice,
    cookieRaw,
    tvl,
  ] = await Promise.all([
    getCachedVaultsList(),
    getCachedConfig(),
    unstableCache(getPaginatedRebalanceActivity, ['rebalanceActivity'], {
      revalidate: CACHE_TIMES.LP_REBALANCE_ACTIVITY,
      tags: [CACHE_TAGS.LP_REBALANCE_ACTIVITY],
    })({
      page: 1,
      limit: 1,
    }),
    unstableCache(getPaginatedLatestActivity, ['latestActivity'], {
      revalidate: CACHE_TIMES.LP_SUMMER_PRO_STATS,
      tags: [CACHE_TAGS.LP_SUMMER_PRO_STATS],
    })({
      page: 1,
      limit: 1,
    }),
    unstableCache(getProtocolsTvl, ['protocolTvls'], {
      revalidate: CACHE_TIMES.LP_PROTOCOLS_TVL,
      tags: [CACHE_TAGS.LP_PROTOCOLS_TVL],
    })(),
    unstableCache(getProtocolsApy, ['protocolApys'], {
      revalidate: CACHE_TIMES.LP_PROTOCOLS_APY,
      tags: [CACHE_TAGS.LP_PROTOCOLS_APY],
    })(),
    getCachedVaultsInfo(),
    getCachedSumrPrice(),
    cookies(),
    getCachedTvl(),
  ])
  const systemConfig = parseServerResponseToClient(configRaw)

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
    daoManagedVaultsList,
  })

  const vaultsApyByNetworkMap = await getCachedVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
    })),
  })

  const vaultsInfo = parseServerResponseToClient(vaultsInfoRaw)

  const totalRebalanceItemsPerStrategyId = rebalanceActivity.totalItemsPerStrategyId
  const { totalUniqueUsers } = latestActivity
  const { tosWhitelist: _tosWhitelist, ...cleanSystemConfig } = systemConfig
  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const sumrPriceUsd = getEstimatedSumrPrice({
    config: systemConfig,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  return NextResponse.json<LandingPageData>({
    systemConfig: cleanSystemConfig as EarnAppConfigType,
    vaultsWithConfig,
    vaultsApyByNetworkMap,
    protocolTvls,
    protocolApys,
    totalRebalanceItemsPerStrategyId,
    vaultsInfo,
    totalUniqueUsers,
    sumrPriceUsd,
    tvl,
  })
}
