import { type SDKVaultType, type SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { getNavPriceChange24h } from '@/helpers/get-nav-price-change-24h'
import { getNavPriceChange30d } from '@/helpers/get-nav-price-change-30d'
import { getVaultNavPriceSkipFirstNDays } from '@/helpers/vault-custom-value-helpers'

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

    // NAV (pricePerShare) changes, computed here where the raw RWA query shape still carries the
    // typed `dailySnapshots`. These survive the later `decorateWithFleetConfig` spread.
    // The 30d Net APY can exclude the vault's volatile first N days via the fleet config's
    // `navPriceSkipFirstNDays`; resolve it from config here since fleet-config decoration (which
    // merges it into customFields) only runs after this point.
    const systemConfig = await getCachedConfig()
    const navPriceSkipFirstNDays = getVaultNavPriceSkipFirstNDays(
      vaultAddress,
      chainId,
      systemConfig,
    )
    const navPriceChange24h = getNavPriceChange24h(vault)
    const navPriceChange30dResult = getNavPriceChange30d(vault, navPriceSkipFirstNDays)

    return {
      ...vault,
      navPriceChange24h,
      navApy30d: navPriceChange30dResult?.apy ?? null,
      navApy30dPartialDays: navPriceChange30dResult?.isPartial
        ? navPriceChange30dResult.daysUsed
        : null,
    } as SDKVaultType
  } catch (error) {
    return serverOnlyErrorHandler(
      'getRwaVaultDetails',
      error instanceof Error ? error.message : 'Unknown error',
    )
  }
}
