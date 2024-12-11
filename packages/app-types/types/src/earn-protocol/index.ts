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
import { EarnAppFleetCustomConfigType } from '../generated/earn-app-config'

export { Network as SDKNetwork }
export { ChainId as SDKChainId }
export { IArmadaPosition }

type ChartDataPoints = {
  timestamp: number
  [key: string]: number
}

export type ChartsDataTimeframes = {
  '90d': ChartDataPoints[]
  '6m': ChartDataPoints[]
  '1y': ChartDataPoints[]
  '3y': ChartDataPoints[]
}

export type VaultChartsHistoricalData = {
  chartsData?: {
    data: ChartsDataTimeframes
    dataNames: string[]
    colors: { [key: string]: string }
  }
}

type VaultCustomFields = {
  // custom fields for vaults - decorated within the earn/lp apps
  customFields?: EarnAppFleetCustomConfigType & VaultChartsHistoricalData
}
export type SDKVaultsListType = GetVaultsQuery['vaults'] & VaultCustomFields
export type SDKVaultType = Exclude<GetVaultQuery['vault'] & VaultCustomFields, null | undefined>
export type SDKGlobalRebalancesType = GetGlobalRebalancesQuery['rebalances']
export type SDKGlobalRebalanceType = SDKGlobalRebalancesType[0]
export type SDKUsersActivityType = GetUsersActivityQuery['positions']
export type SDKUserActivityType = SDKUsersActivityType[0]

export type Risk = 'low' | 'medium' | 'high'

// -ish because it can be a detailed vault or a vault from list (less details), use with that in mind
export type SDKVaultishType = (SDKVaultType | SDKVaultsListType[number]) & VaultCustomFields

export const sdkSupportedNetworks = [Network.ArbitrumOne, Network.Base] as const
export const sdkSupportedChains = [ChainId.ARBITRUM, ChainId.BASE] as const
export type SDKSupportedNetwork = (typeof sdkSupportedNetworks)[number]
export type SDKSupportedChain = (typeof sdkSupportedChains)[number]

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

export type EarnTransactionTypes = 'approve' | 'deposit' | 'withdraw'
export type EarnAllowanceTypes = 'deposit' | 'custom'

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

export type ForecastDataPoints = {
  timestamp: string
  forecast: number
  bounds: [number, number]
}[]

export type ForecastData = {
  generatedAt: string
  amount: number
  dataPoints: {
    daily: ForecastDataPoints
    weekly: ForecastDataPoints
    monthly: ForecastDataPoints
  }
}

export type ArkDetailsType = {
  protocol: string
  type: string
  asset: string
  marketAsset: string
  pool: string
  chainId: number
}
