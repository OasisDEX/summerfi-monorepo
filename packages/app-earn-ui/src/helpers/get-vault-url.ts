import {
  type SDKNetwork,
  sdkNetworkToHumanNetwork,
  type SDKVaultishType,
} from '@summerfi/app-types'

export const getVaultUrl = (vault?: SDKVaultishType) => {
  if (!vault) return ''

  return `/earn/${sdkNetworkToHumanNetwork(vault.protocol.network)}/position/${vault.id}`
}

export const getVaultDetailsUrl = (vault?: SDKVaultishType) => {
  if (!vault) return ''

  return `/earn/${sdkNetworkToHumanNetwork(vault.protocol.network)}/details/${vault.id}`
}

export const getVaultPositionUrl = ({
  network,
  vaultId,
  walletAddress,
}: {
  network: SDKNetwork
  vaultId: string
  walletAddress: string
}) => `/earn/${sdkNetworkToHumanNetwork(network)}/position/${vaultId}/${walletAddress}`
