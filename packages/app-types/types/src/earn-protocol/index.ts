import {
  Network,
  GetVaultsQuery,
  GetVaultQuery,
  GetGlobalRebalancesQuery,
  GetUsersActivityQuery,
} from '@summerfi/subgraph-manager-common'
import { ChainId } from '@summerfi/serverless-shared'
import { type TransactionInfo } from '@summerfi/sdk-common'
import { type IArmadaPosition } from '@summerfi/armada-protocol-common'

export { Network as SDKNetwork }
export { ChainId as SDKChainId }
export { IArmadaPosition }

export type SDKVaultsListType = GetVaultsQuery['vaults']
export type SDKVaultType = Exclude<GetVaultQuery['vault'], null | undefined>
export type SDKGlobalRebalancesType = GetGlobalRebalancesQuery['rebalances']
export type SDKGlobalRebalanceType = SDKGlobalRebalancesType[0]
export type SDKUsersActivityType = GetUsersActivityQuery['positions']
export type SDKUserActivityType = SDKUsersActivityType[0]

// -ish because it can be a detailed vault or a vault from list (less details), use with that in mind
export type SDKVaultishType = SDKVaultType | SDKVaultsListType[number]

export const sdkSupportedChains = [ChainId.ARBITRUM, ChainId.BASE] as const

export const isSupportedSDKChain = (chainId: unknown): chainId is ChainId.ARBITRUM | ChainId.BASE =>
  typeof chainId === 'number' && sdkSupportedChains.includes(chainId)

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

export enum UserActivityType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export interface UserActivity {
  timestamp: SDKUserActivityType['deposits'][0]['timestamp']
  amount: SDKUserActivityType['deposits'][0]['amount']
  balance: SDKUserActivityType['inputTokenBalance']
  vault: SDKUserActivityType['vault']
  account: SDKUserActivityType['account']['id']
  activity: UserActivityType
  hash: SDKUserActivityType['deposits'][0]['hash']
}

export type UsersActivity = UserActivity[]

export type PositionForecastAPIResponse = {
  metadata: {
    fleet_commander_address: string
    initial_position_size: number
    chain_id: ChainId
    chain_name: string
    forecast_generated_at: string
    forecast_period: string
  }
  forecast: {
    timestamps: string[]
    series: {
      name: 'forecast' | 'upper_bound' | 'lower_bound'
      data: number[]
    }[]
  }
}

export type ForecastDataPoint = {
  timestamp: string
  forecast: number
  bounds: [number, number]
}[]

export type ForecastData = {
  generatedAt: string
  dataPoints: {
    daily: ForecastDataPoint
    weekly: ForecastDataPoint
    monthly: ForecastDataPoint
  }
}
