import { type IArmadaPosition, type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'
import { type IArmadaVaultInfo } from '@summerfi/sdk-common'

type MergePositionWithVaultProps = {
  position: IArmadaPosition
  vaultsWithConfig: SDKVaultishType[]
  vaultsInfo?: (IArmadaVaultInfo | undefined)[]
}

// since we dont have vault details on the positions list
// we need to merge the vault details with the position
export const mergePositionWithVault = ({
  position,
  vaultsWithConfig,
  vaultsInfo,
}: MergePositionWithVaultProps) => {
  const vaultData = vaultsWithConfig.find(
    (vault) =>
      vault.id.toLowerCase() === position.pool.id.fleetAddress.value.toLowerCase() &&
      subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network)) ===
        position.id.user.chainInfo.chainId,
  )

  if (!vaultData) {
    throw new Error(
      `Vault not found for position ${position.pool.id.fleetAddress.value} on ${position.id.user.chainInfo.chainId}, available vaults: ${vaultsWithConfig.map((v) => `${v.id} on ${v.protocol.network}`).join(', ')}`,
    )
  }

  const vaultInfo = vaultsInfo?.find(
    (vault) => vault?.id.fleetAddress.value.toLowerCase() === vaultData.id.toLowerCase(),
  )

  if (!vaultInfo) {
    throw new Error(`Vault info not found for vault ${vaultData.id}`)
  }

  return {
    position,
    vault: vaultData,
    vaultInfo,
  }
}

export type PositionWithVault = Awaited<ReturnType<typeof mergePositionWithVault>>
