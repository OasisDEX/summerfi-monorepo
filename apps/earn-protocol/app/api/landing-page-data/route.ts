import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import {
  type LandingPageData,
  supportedDefillamaProtocols,
  supportedDefillamaProtocolsConfig,
  type SupportedDefillamaTvlProtocols,
} from '@summerfi/app-types'
import {
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import { NextResponse } from 'next/server'

import { getCachedConfig } from '@/app/server-handlers/cached/config'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsInfo } from '@/app/server-handlers/cached/get-vaults-info'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getMedianDefiProjectYield } from '@/app/server-handlers/defillama/get-median-defi-project-yield'
import { getProtocolTvl } from '@/app/server-handlers/defillama/get-protocol-tvl'
import { getProAppStats } from '@/app/server-handlers/pro-app-stats/get-pro-app-stats'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
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
}

const getProtocolsTvl = async (): Promise<{
  [key in SupportedDefillamaTvlProtocols]: bigint
}> => {
  const protocolTvlsArray = await Promise.all(
    supportedDefillamaProtocols.map((protocol) => {
      return getProtocolTvl(
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
      return getMedianDefiProjectYield({
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
    proAppStats,
    protocolTvls,
    protocolApys,
    vaultsInfoRaw,
  ] = await Promise.all([
    getCachedVaultsList(),
    getCachedConfig(),
    unstableCache(getPaginatedRebalanceActivity, [REVALIDATION_TAGS.LP_REBALANCE_ACTIVITY], {
      revalidate: REVALIDATION_TIMES.LP_REBALANCE_ACTIVITY,
      tags: [REVALIDATION_TAGS.LP_REBALANCE_ACTIVITY],
    })({
      page: 1,
      limit: 1,
    }),
    unstableCache(getPaginatedLatestActivity, [REVALIDATION_TAGS.LP_SUMMER_PRO_STATS], {
      revalidate: REVALIDATION_TIMES.LP_SUMMER_PRO_STATS,
      tags: [REVALIDATION_TAGS.LP_SUMMER_PRO_STATS],
    })({
      page: 1,
      limit: 1,
    }),
    unstableCache(getProAppStats, [REVALIDATION_TAGS.LP_SUMMER_PRO_STATS], {
      revalidate: REVALIDATION_TIMES.LP_SUMMER_PRO_STATS,
      tags: [REVALIDATION_TAGS.LP_SUMMER_PRO_STATS],
    })(),
    unstableCache(getProtocolsTvl, [REVALIDATION_TAGS.LP_PROTOCOLS_TVL], {
      revalidate: REVALIDATION_TIMES.LP_PROTOCOLS_TVL,
      tags: [REVALIDATION_TAGS.LP_PROTOCOLS_TVL],
    })(),
    unstableCache(getProtocolsApy, [REVALIDATION_TAGS.LP_PROTOCOLS_APY], {
      revalidate: REVALIDATION_TIMES.LP_PROTOCOLS_APY,
      tags: [REVALIDATION_TAGS.LP_PROTOCOLS_APY],
    })(),
    getCachedVaultsInfo(),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
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

  return NextResponse.json({
    systemConfig: cleanSystemConfig,
    vaultsWithConfig,
    vaultsApyByNetworkMap,
    protocolTvls,
    protocolApys,
    totalRebalanceItemsPerStrategyId,
    proAppStats,
    vaultsInfo,
    totalUniqueUsers,
  } as LandingPageData)
}
