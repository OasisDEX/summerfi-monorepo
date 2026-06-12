import {
  networkNameToSDKId,
  parseServerResponseToClient,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedRwaVaultsInfo } from '@/app/server-handlers/cached/get-rwa-vaults-info'
import {
  emptyWalletAssets,
  getCachedWalletAssets,
} from '@/app/server-handlers/cached/get-wallet-assets'
import { decorateVaultsWithFees } from '@/app/server-handlers/fleet-fees/decorate-vaults-with-fees'
import { getRwaVaultsListRaw } from '@/app/server-handlers/sdk/get-rwa-vaults-list'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

// Shared by the /api/rwa-vaults-list route and the server-side prefetch in the page.
export const getRwaVaultsListData = async (walletAddress?: string) => {
  const { vaults } = await getRwaVaultsListRaw()

  // Build a live minPositionSize map before decoration (base units → display value).
  const liveMinDeposit: { [key: string]: number } = {}

  for (const vault of vaults) {
    const inputVault = vault.roundsVaultPair?.inputVault

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (inputVault?.minPositionSize != null && inputVault.underlyingToken.decimals != null) {
      liveMinDeposit[vault.id] = new BigNumber(inputVault.minPositionSize.toString())
        .div(ten.pow(inputVault.underlyingToken.decimals))
        .toNumber()
    }
  }

  const [configRaw, vaultsInfoRaw, walletAssets] = await Promise.all([
    getCachedConfig(),
    getCachedRwaVaultsInfo(),
    walletAddress ? getCachedWalletAssets(walletAddress, true) : Promise.resolve(emptyWalletAssets),
  ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = await decorateVaultsWithFees(
    decorateVaultsWithConfig({
      systemConfig,
      vaults,
      daoManagedVaultsList: [],
    }).map((vault) => {
      // special case for RWA vaults - we want to override the minimumDeposit from config with the live one fetched from subgraph
      const minDeposit = liveMinDeposit[vault.id]

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (minDeposit == null || vault.customFields == null) return vault

      return {
        ...vault,
        customFields: { ...vault.customFields, minimumDeposit: minDeposit },
      }
    }),
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
