import { type SDKVaultishType, type SupportedSDKNetworks } from '@summerfi/app-types'
import { sdkNetworkToHumanNetwork, supportedSDKNetwork } from '@summerfi/app-utils'

export const getVaultUrl = (vault?: SDKVaultishType): string => {
  if (!vault) return ''

  return `/${sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network))}/position/${vault.customFields?.slug ?? vault.id}`
}

export const getVaultDetailsUrl = (vault?: SDKVaultishType): string => {
  if (!vault) return ''

  return `/${sdkNetworkToHumanNetwork(supportedSDKNetwork(vault.protocol.network))}/details/${vault.customFields?.slug ?? vault.id}`
}

export const getVaultPositionUrl = ({
  network,
  vaultId,
  walletAddress,
}: {
  network: SupportedSDKNetworks
  vaultId: string
  walletAddress: string
}) => `/${sdkNetworkToHumanNetwork(network)}/position/${vaultId}/${walletAddress.toLowerCase()}`

export const getMigrationVaultUrl = ({
  network,
  vaultId,
  walletAddress,
  selectedPosition,
}: {
  network: SupportedSDKNetworks
  vaultId: string
  walletAddress?: string
  selectedPosition?: string
}): string => {
  if (!selectedPosition || !walletAddress) {
    return ''
  }

  return `/migrate/${sdkNetworkToHumanNetwork(network)}/position/${vaultId}/${walletAddress.toLowerCase()}/${selectedPosition}`
}

export const getMigrationLandingPageUrl = ({
  walletAddress,
  selectedPosition,
}: {
  walletAddress?: string
  selectedPosition?: string
}): string => {
  if (!selectedPosition || !walletAddress) {
    return ''
  }

  return `/migrate/user/${walletAddress.toLowerCase()}?positionId=${selectedPosition}`
}
