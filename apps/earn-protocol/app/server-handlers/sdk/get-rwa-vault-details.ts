import { type SDKVaultType, type SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { getNavPriceChange24h } from '@/helpers/get-nav-price-change-24h'

export async function getRwaVaultDetails({
  vaultAddress,
  network,
}: {
  vaultAddress?: string
  network: SupportedSDKNetworks
}) {
  try {
    if (!vaultAddress) {
      return undefined
    }

    const chainId = subgraphNetworkToId(network)
    const chainInfo = getChainInfoByChainId(chainId)

    const fleetAddress = Address.createFromEthereum({
      value: vaultAddress,
    })
    const poolId = ArmadaVaultId.createFrom({
      chainInfo,
      fleetAddress,
    })
    const { vault } = await backendInstiSDK.rwa.getVaultRaw({
      vaultId: poolId,
    })

    if (!vault) {
      return undefined
    }

    // day-over-day NAV (pricePerShare) change, computed here where the raw RWA query shape still
    // carries the typed `dailySnapshots`. Survives the later `decorateWithFleetConfig` spread.
    const navPriceChange24h = getNavPriceChange24h(vault)

    return { ...vault, navPriceChange24h } as SDKVaultType
  } catch (error) {
    return serverOnlyErrorHandler(
      'getRwaVaultDetails',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}
