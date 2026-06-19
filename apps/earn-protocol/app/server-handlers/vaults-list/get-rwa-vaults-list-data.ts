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
import { decorateVaultsWithFees } from '@/app/server-handlers/fleet-fees/decorate-vaults-with-fees'
import { getRwaVaultsListRaw } from '@/app/server-handlers/sdk/get-rwa-vaults-list'
import {
  buildRwaLiveMinDepositMap,
  decorateVaultsWithConfig,
  withRwaLiveMinDeposit,
} from '@/helpers/vault-custom-value-helpers'

// Shared by the /api/rwa-vaults-list route and the server-side prefetch in the page.
export const getRwaVaultsListData = async (walletAddress?: string) => {
  const { vaults } = await getRwaVaultsListRaw()

  // Live minPositionSize map (base units → display value), overlaid onto customFields after decoration.
  const liveMinDeposit = buildRwaLiveMinDepositMap(vaults)

  const [configRaw, vaultsInfoRaw, walletAssets] = await Promise.all([
    getCachedConfig(),
    getCachedRwaVaultsInfo(),
    walletAddress ? getCachedWalletAssets(walletAddress, true) : Promise.resolve(emptyWalletAssets),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = await decorateVaultsWithFees(
    // Override the config minimumDeposit with the live one fetched from the subgraph (RWA special case).
    decorateVaultsWithConfig({
      systemConfig,
      vaults,
      daoManagedVaultsList: [],
    }).map((vault) => withRwaLiveMinDeposit(vault, liveMinDeposit)),
  )

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
