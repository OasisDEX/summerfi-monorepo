import { type IArmadaVaultInfo, type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'

/**
 * Finds the vault info for a given vault
 * @param vaultsInfo - The list of vaults info
 * @param vault - The vault to find the info for
 * @returns The vault info for the given vault
 */
export const findVaultInfo = (
  vaultsInfo: IArmadaVaultInfo[] | undefined,
  vault: SDKVaultishType | undefined,
): IArmadaVaultInfo | undefined => {
  return vaultsInfo?.find(
    (vaultInfo) =>
      vaultInfo.id.fleetAddress.value === vault?.id &&
      vaultInfo.id.chainInfo.chainId ===
        subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network)),
  )
}
