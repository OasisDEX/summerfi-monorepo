import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'
import { NextResponse } from 'next/server'

import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'

/**
 * This is for external vendors to get the list of vaults with their APY.
 */

export async function GET() {
  const { vaults } = await getCachedVaultsList()

  const vaultsApyByNetworkMap = await getCachedVaultsApy({
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
