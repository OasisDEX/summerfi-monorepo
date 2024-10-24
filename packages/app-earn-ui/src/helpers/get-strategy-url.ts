import { type SDKVaultsListType, type SDKVaultType } from '@summerfi/app-types'

export const getStrategyUrl = (selectedStrategy: SDKVaultType | SDKVaultsListType[number]) => {
  if (!selectedStrategy) return ''

  return `/earn/${selectedStrategy.protocol.network.toLowerCase()}/position/${selectedStrategy.id}`
}
