import { type SDKNetwork, type SDKVaultishType } from '@summerfi/app-types'

export const getVaultUrl = (vault?: SDKVaultishType) => {
  if (!vault) return ''

  return `/earn/${vault.protocol.network.toLowerCase()}/position/${vault.id}`
}

export const getVaultDetailsUrl = (vault?: SDKVaultishType) => {
  if (!vault) return ''

  return `/earn/${vault.protocol.network.toLowerCase()}/details/${vault.id}`
}

export const getVaultPositionUrl = ({
  network,
  vaultId,
  walletAddress,
}: {
  network: SDKNetwork
  vaultId: string
  walletAddress: string
}) => `/earn/${network.toLowerCase()}/position/${vaultId}/${walletAddress}`
