import { type SDKVaultType } from '@summerfi/app-types'

export const getStrategyUrl = (selectedStrategy: SDKVaultType) => {
  if (!selectedStrategy) return ''
  console.log('selectedStrategy', selectedStrategy)

  return `/earn/${selectedStrategy.protocol.network.toLowerCase()}/position/${selectedStrategy.id}`
}
