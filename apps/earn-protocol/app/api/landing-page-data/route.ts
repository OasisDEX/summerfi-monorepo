import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { configEarnAppFetcher, getVaultsApy, getVaultsInfo } from '@summerfi/app-server-handlers'
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

import { getMedianDefiProjectYield } from '@/app/server-handlers/defillama/get-median-defi-project-yield'
import { getProtocolTvl } from '@/app/server-handlers/defillama/get-protocol-tvl'
import { getProAppStats } from '@/app/server-handlers/pro-app-stats/get-pro-app-stats'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
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
    proAppStats,
    protocolTvls,
    protocolApys,
    vaultsInfoRaw,
  ] = await Promise.all([
    getVaultsList(),
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
      tags: [REVALIDATION_TAGS.CONFIG],
    })(),
    getPaginatedRebalanceActivity({
      page: 1,
      limit: 1,
    }),
    getProAppStats(),
    getProtocolsTvl(),
    getProtocolsApy(),
    unstableCache(getVaultsInfo, [REVALIDATION_TAGS.VAULTS_LIST], {
      revalidate: REVALIDATION_TIMES.VAULTS_LIST,
      tags: [REVALIDATION_TAGS.VAULTS_LIST],
    })(),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
  })

  const vaultsApyByNetworkMap = await getVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
    })),
  })

  const vaultsInfo = parseServerResponseToClient(vaultsInfoRaw)

  const totalRebalanceItemsPerStrategyId = rebalanceActivity.totalItemsPerStrategyId

  return NextResponse.json({
    systemConfig,
    vaultsWithConfig,
    vaultsApyByNetworkMap,
    protocolTvls,
    protocolApys,
    totalRebalanceItemsPerStrategyId,
    proAppStats,
    vaultsInfo,
  } as LandingPageData)
}
