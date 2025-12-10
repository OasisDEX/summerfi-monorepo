import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { getVaultsApy } from '@summerfi/app-server-handlers'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import { NextResponse } from 'next/server'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'

/**
 * This is for external vendors to get the list of vaults with their APY.
 */

export async function GET() {
  const { vaults } = await getVaultsList()

  const vaultsApyByNetworkMap = await unstableCache(getVaultsApy, [], {
    revalidate: REVALIDATION_TIMES.VAULTS_LIST,
    tags: [REVALIDATION_TAGS.VAULTS_LIST],
  })({
    fleets: vaults.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
    })),
  })

  const mappedVaultsList = Object.fromEntries(
    vaults.map((vault) => {
      const vaultExternalId =
        `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}` as const
      const apy = vaultsApyByNetworkMap[vaultExternalId]

      return [
        vaultExternalId,
        {
          apy: Number(Number(apy.apy) * 100).toFixed(2),
          apy24h: Number(Number(apy.sma24h) * 100).toFixed(2),
          apy7d: Number(Number(apy.sma7d) * 100).toFixed(2),
          apy30d: Number(Number(apy.sma30d) * 100).toFixed(2),
          apyTimestamp: apy.apyTimestamp,
        },
      ]
    }),
  )

  return NextResponse.json({
    vaults: mappedVaultsList,
  })
}
