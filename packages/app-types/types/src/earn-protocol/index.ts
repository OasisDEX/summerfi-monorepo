import { Network, GetVaultsQuery, GetVaultQuery } from '@summerfi/subgraph-manager-common'
import { ChainId } from '@summerfi/serverless-shared'

export { Network as SDKNetwork }
export { ChainId as SDKChainId }

export type SDKVaultsListType = GetVaultsQuery['vaults']
export type SDKVaultType = Exclude<GetVaultQuery['vault'], null | undefined>

// -ish because it can be a detailed vault or a vault from list (less details), use with that in mind
export type SDKVaultishType = SDKVaultType | SDKVaultsListType[number]

export const sdkSupportedNetworks = [ChainId.ARBITRUM, ChainId.BASE] as const

export type SDKSupportedNetworkType = ChainId.ARBITRUM | ChainId.BASE
export enum SDKSupportedNetworkIdsEnum {
  ARBITRUM = ChainId.ARBITRUM,
  BASE = ChainId.BASE,
}
