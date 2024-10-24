import { Network, GetVaultsQuery, GetVaultQuery } from '@summerfi/subgraph-manager-common'

export { Network as SDKNetwork }

export type SDKVaultsListType = GetVaultsQuery['vaults']
export type SDKVaultType = Exclude<GetVaultQuery['vault'], null | undefined>
export type SDKVaultishType = SDKVaultType | SDKVaultsListType[number]
