import {
  type LandingPageData,
  supportedDefillamaProtocols,
  supportedDefillamaProtocolsConfig,
  type SupportedDefillamaTvlProtocols,
} from '@summerfi/app-types'
import { parseServerResponseToClient, subgraphNetworkToId } from '@summerfi/app-utils'
import { NextResponse } from 'next/server'

import { getProtocolTvl } from '@/app/server-handlers/defillama/get-protocol-tvl'
import { getProAppStats } from '@/app/server-handlers/pro-app-stats/get-pro-app-stats'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

const emptyTvls = {
  aave: 0n,
  sky: 0n,
  spark: 0n,
  pendle: 0n,
  euler: 0n,
  gearbox: 0n,
  compound: 0n,
  ethena: 0n,
  fluid: 0n,
}

export async function GET() {
  const [{ vaults }, configRaw, rebalanceActivity, proAppStats, ...protocolTvlsArray] =
    await Promise.all([
      getVaultsList(),
      systemConfigHandler(),
      getPaginatedRebalanceActivity({
        page: 1,
        limit: 1,
      }),
      getProAppStats(),
      ...supportedDefillamaProtocols.map((protocol) => {
        return getProtocolTvl(
          supportedDefillamaProtocolsConfig[
            protocol as keyof typeof supportedDefillamaProtocolsConfig
          ].defillamaProtocolName,
          protocol,
        )
      }),
    ])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
  })

  const vaultsApyByNetworkMap = await getVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(network),
    })),
  })

  const totalRebalanceItemsPerStrategyId = rebalanceActivity.totalItemsPerStrategyId

  const protocolTvls = protocolTvlsArray
    // filter zero TVL protocols (set to zero because of an error)
    .filter((protocolTVL) => Object.values(protocolTVL).some((tvl) => tvl !== '0'))
    .reduce<{
      [key in SupportedDefillamaTvlProtocols]: bigint
    }>((acc, curr) => ({ ...acc, ...curr }), emptyTvls)

  return NextResponse.json({
    systemConfig,
    vaultsWithConfig,
    vaultsApyByNetworkMap,
    protocolTvls,
    totalRebalanceItemsPerStrategyId,
    proAppStats,
  } as LandingPageData)
}
