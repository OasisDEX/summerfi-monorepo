import { Network, GetVaultsQuery } from '@summerfi/subgraph-manager-common'

export { Network as SDKNetwork }

export type SDKVaultsListType = GetVaultsQuery['vaults']
