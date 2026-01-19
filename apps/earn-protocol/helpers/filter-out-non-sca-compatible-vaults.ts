import { type SDKVaultsListType } from '@summerfi/app-types'
import { Network } from '@summerfi/subgraph-manager-common'

/**
  Filters out vaults that are not compatible with Smart Contract Accounts (SCA)
  on sonic and hyperliquid
 */
export const filterOutNonSCACompatibleVaults = (vaults: SDKVaultsListType): SDKVaultsListType =>
  vaults.filter((item) => ![Network.SonicMainnet].includes(item.protocol.network))
