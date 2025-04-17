import {
  Network,
  GetVaultsQuery,
  GetVaultQuery,
  GetGlobalRebalancesQuery,
  GetUsersActivityQuery,
} from '@summerfi/subgraph-manager-common'
import { IArmadaPosition } from '@summerfi/sdk-common'
import { ChainId } from '@summerfi/serverless-shared'
import { EarnAppFleetCustomConfigType } from '../generated/earn-app-config'
import { TimeframesType } from '../components'

export { Network as SDKNetwork }
export { ChainId as SDKChainId }
export type { IArmadaPosition as IArmadaPosition }

export type ChartDataPoints = {
  timestamp: number
  [key: string]: number | string | number[]
}

export type ChartsDataTimeframes = {
  [key in TimeframesType]: ChartDataPoints[]
}

export type PerformanceChartData = {
  historic: ChartsDataTimeframes
  forecast: ChartsDataTimeframes
}

export type HistoryChartData = {
  data: ChartsDataTimeframes
}

export type ArksHistoricalChartData = {
  data: ChartsDataTimeframes
  dataNames: string[]
  colors: { [key: string]: string }
}

type VaultCustomFields = {
  // custom fields for vaults - decorated within the earn/lp apps
  customFields?: EarnAppFleetCustomConfigType
}

export type SDKVaultsListType = (GetVaultsQuery['vaults'][number] & VaultCustomFields)[]
export type SDKVaultType = Exclude<GetVaultQuery['vault'] & VaultCustomFields, null | undefined>
export type SDKGlobalRebalancesType = GetGlobalRebalancesQuery['rebalances']
export type SDKGlobalRebalanceType = SDKGlobalRebalancesType[0]
export type SDKUsersActivityType = GetUsersActivityQuery['positions']
export type SDKUserActivityType = SDKUsersActivityType[0]

// -ish because it can be a detailed vault or a vault from list (less details), use with that in mind
export type SDKVaultishType = (SDKVaultType | SDKVaultsListType[number]) & VaultCustomFields

export const sdkSupportedNetworks = [
  Network.ArbitrumOne,
  Network.Base,
  Network.Mainnet,
  Network.SonicMainnet,
] as const

export const sdkSupportedChains = [
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.MAINNET,
  ChainId.SONIC,
] as const

export type SDKSupportedNetwork = (typeof sdkSupportedNetworks)[number]
export type SDKSupportedChain = (typeof sdkSupportedChains)[number]

export enum SDKSupportedNetworkIdsEnum {
  ARBITRUM = ChainId.ARBITRUM,
  BASE = ChainId.BASE,
  OPTIMISM = ChainId.OPTIMISM,
  MAINNET = ChainId.MAINNET,
  SONIC = ChainId.SONIC,
}

export type EarnTransactionViewStates =
  | 'idle'
  | 'loadingTx'
  | 'txPrepared'
  | 'txInProgress'
  | 'txError'
  | 'txSuccess'

export type EarnAllowanceTypes = 'deposit' | 'custom'

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

type ForecastAPIPoints = {
  timestamps: string[]
  forecast: number[]
  lower_bound: number[]
  upper_bound: number[]
}

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
    hourly: ForecastAPIPoints
    daily: ForecastAPIPoints
    weekly: ForecastAPIPoints
    apy_metrics: {
      average_apy: number
      effective_apy: number
    }
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
    hourly: ForecastDataPoints
    daily: ForecastDataPoints
    weekly: ForecastDataPoints
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

export type GetInterestRatesParams = {
  network: Network
  dailyCount?: number
  hourlyCount?: number
  weeklyCount?: number
  arksList: SDKVaultishType['arks'] | SDKVaultType['arks']
  justLatestRates?: boolean
}

export type PlatformLogo = 'aave' | 'spark' | 'morpho' | 'summer'

export type VaultApyData = {
  apy: number
  apyTimestamp: number | null
  sma24h: number | null
  sma7d: number | null
  sma30d: number | null
}

export type EarnProtocolDbNetwork = 'arbitrum' | 'optimism' | 'base' | 'mainnet' | 'sonic'

export interface FleetRate {
  id: string
  rate: string
  timestamp: number
  fleetAddress: string
}
