import {
  networkNameToSDKId,
  parseServerResponseToClient,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedRwaVaultsInfo } from '@/app/server-handlers/cached/get-rwa-vaults-info'
import {
  emptyWalletAssets,
  getCachedWalletAssets,
} from '@/app/server-handlers/cached/get-wallet-assets'
import { getRwaVaultsListRaw } from '@/app/server-handlers/sdk/get-rwa-vaults-list'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

// Shared by the /api/rwa-vaults-list route and the server-side prefetch in the page.
export const getRwaVaultsListData = async (walletAddress?: string) => {
  const { vaults } = await getRwaVaultsListRaw()

  const [configRaw, vaultsInfoRaw, walletAssets] = await Promise.all([
    getCachedConfig(),
    getCachedRwaVaultsInfo(),
    walletAddress ? getCachedWalletAssets(walletAddress, true) : Promise.resolve(emptyWalletAssets),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
    daoManagedVaultsList: [],
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
    vaultsInfo: vaultsInfo.vaults,
  }
}
