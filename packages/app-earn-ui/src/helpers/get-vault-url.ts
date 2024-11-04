import { type SDKVaultishType } from '@summerfi/app-types'

export const getVaultUrl = (vault?: SDKVaultishType) => {
  if (!vault) return ''

  return `/earn/${vault.protocol.network.toLowerCase()}/position/${vault.id}`
}

export const getVaultDetailsUrl = (vault?: SDKVaultishType) => {
  if (!vault) return ''

  return `/earn/${vault.protocol.network.toLowerCase()}/details/${vault.id}`
}

export const getVaultPositionUrl = (vault: SDKVaultishType, walletAddress: string) =>
  `/earn/${vault.protocol.network.toLowerCase()}/position/${vault.id}/${walletAddress}`
