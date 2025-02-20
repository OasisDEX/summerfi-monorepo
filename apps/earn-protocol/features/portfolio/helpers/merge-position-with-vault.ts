import { type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'

export type MergePositionWithVaultProps = {
  position: IArmadaPosition
  vaultsWithConfig: SDKVaultishType[]
}

// since we dont have vault details on the positions list
// we need to merge the vault details with the position
export const mergePositionWithVault = ({
  position,
  vaultsWithConfig,
}: MergePositionWithVaultProps) => {
  const vaultData = vaultsWithConfig.find(
    (vault) =>
      vault.id === position.pool.id.fleetAddress.value &&
      subgraphNetworkToSDKId(vault.protocol.network) === position.id.user.chainInfo.chainId,
  )

  if (!vaultData) {
    throw new Error(`Vault not found for position ${position.pool.id.fleetAddress.value}`)
  }

  return {
    position,
    vault: vaultData,
  }
}

export type PositionWithVault = Awaited<ReturnType<typeof mergePositionWithVault>>
