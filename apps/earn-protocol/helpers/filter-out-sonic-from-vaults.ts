import { type SDKVaultsListType } from '@summerfi/app-types'
import { Network } from '@summerfi/subgraph-manager-common'

/**
 * Temporarly method to filter out Sonic vaults from the list of vaults.
 * This is a temporary solution to avoid issues with SCA accounts on Sonic Mainnet.
 * TODO: Remove this method when SCA accounts are supported on Sonic Mainnet.
 * @param vaults - The list of vaults to filter.
 * @returns The filtered list of vaults.
 */
export const filterOutSonicFromVaults = (vaults: SDKVaultsListType): SDKVaultsListType =>
  vaults.filter((item) => item.protocol.network !== Network.SonicMainnet)
