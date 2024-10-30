import { type SDKVaultsListType, type SDKVaultType } from '@summerfi/app-types'

export const getVaultUrl = (vault?: SDKVaultType | SDKVaultsListType[number]) => {
  if (!vault) return ''

  return `/earn/${vault.protocol.network.toLowerCase()}/position/${vault.id}`
}

export const getVaultDetailsUrl = (vault?: SDKVaultType | SDKVaultsListType[number]) => {
  if (!vault) return ''

  return `/earn/${vault.protocol.network.toLowerCase()}/details/${vault.id}`
}
