import {
  Network,
  GetVaultsQuery,
  GetVaultQuery,
  GetGlobalRebalancesQuery,
} from '@summerfi/subgraph-manager-common'
import { ChainId } from '@summerfi/serverless-shared'
import { type TransactionInfo } from '@summerfi/sdk-common'

export { Network as SDKNetwork }
export { ChainId as SDKChainId }

export type SDKVaultsListType = GetVaultsQuery['vaults']
export type SDKVaultType = Exclude<GetVaultQuery['vault'], null | undefined>
export type SDKGlobalRebalancesType = GetGlobalRebalancesQuery['rebalances']
export type SDKGlobalRebalanceType = SDKGlobalRebalancesType[0]

// -ish because it can be a detailed vault or a vault from list (less details), use with that in mind
export type SDKVaultishType = SDKVaultType | SDKVaultsListType[number]

export const sdkSupportedNetworks = [ChainId.ARBITRUM, ChainId.BASE] as const

export type SDKSupportedNetworkType = ChainId.ARBITRUM | ChainId.BASE
export enum SDKSupportedNetworkIdsEnum {
  ARBITRUM = ChainId.ARBITRUM,
  BASE = ChainId.BASE,
}

export type EarnTransactionViewStates =
  | 'idle'
  | 'loadingTx'
  | 'txPrepared'
  | 'txInProgress'
  | 'txError'
  | 'txSuccess'

export type EarnTransactionTypes = 'approve' | 'deposit'

export type TransactionInfoLabeled = TransactionInfo & {
  label: EarnTransactionTypes
}
