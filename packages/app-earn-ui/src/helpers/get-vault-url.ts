import { type SDKVaultsListType, type SDKVaultType } from '@summerfi/app-types'

export const getVaultUrl = (selectedVault?: SDKVaultType | SDKVaultsListType[number]) => {
  if (!selectedVault) return ''

  return `/earn/${selectedVault.protocol.network.toLowerCase()}/position/${selectedVault.id}`
}
export const getVaultDetailsUrl = (selectedVault?: SDKVaultType | SDKVaultsListType[number]) => {
  if (!selectedVault) return ''

  return `/earn/${selectedVault.protocol.network.toLowerCase()}/details/${selectedVault.id}`
}
