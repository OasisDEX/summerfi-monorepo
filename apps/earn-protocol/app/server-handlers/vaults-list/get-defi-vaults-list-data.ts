import {
  networkNameToSDKId,
  parseServerResponseToClient,
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsInfo } from '@/app/server-handlers/cached/get-vaults-info'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import {
  emptyWalletAssets,
  getCachedWalletAssets,
} from '@/app/server-handlers/cached/get-wallet-assets'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

// Shared by the /api/defi-vaults-list route and the server-side prefetch in the page, so the
// list data has a single source of truth and can be hydrated without a client round trip.
export const getDefiVaultsListData = async (walletAddress?: string) => {
  const { vaults } = await getCachedVaultsList()

  const vaultsApyPromise = getCachedVaultsApy({
    fleets: vaults.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
    })),
  })

  const [configRaw, vaultsInfoRaw, walletAssets, daoManagedVaultsList, vaultsApyByNetworkMap] =
    await Promise.all([
      getCachedConfig(),
      getCachedVaultsInfo(),
      walletAddress
        ? getCachedWalletAssets(walletAddress, true)
        : Promise.resolve(emptyWalletAssets),
      getDaoManagedVaultsIDsList(vaults),
      vaultsApyPromise,
    ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
    daoManagedVaultsList,
  })

  const filteredWalletAssetsVaults = walletAddress
    ? vaultsWithConfig.filter((vault) => {
        return walletAssets.assets.some(
          (asset) =>
            asset.symbol.toLowerCase() === vault.inputToken.symbol.toLowerCase() &&
            networkNameToSDKId(asset.network) ===
              subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network)),
        )
      })
    : []

  const vaultsInfo = parseServerResponseToClient(vaultsInfoRaw)

  return {
    vaultsList: vaultsWithConfig,
    filteredWalletAssetsVaults,
    vaultsApyByNetworkMap,
    vaultsInfo,
  }
}
