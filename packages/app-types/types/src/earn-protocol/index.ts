import {
  Network,
  GetVaultsQuery,
  GetVaultQuery,
  GetGlobalRebalancesQuery,
  GetUsersActivityQuery,
} from '@summerfi/subgraph-manager-common'
import {
  IArmadaPosition,
  VaultSwitchTransactionInfo,
  IArmadaVaultInfo,
  DepositTransactionInfo,
  WithdrawTransactionInfo,
  ClaimTransactionInfo,
  DelegateTransactionInfo,
  StakeTransactionInfo,
  UnstakeTransactionInfo,
  ApproveTransactionInfo,
} from '@summerfi/sdk-common'
import { ChainId } from '@summerfi/serverless-shared'
import { EarnAppConfigType, EarnAppFleetCustomConfigType } from '../generated/earn-app-config'
import { TimeframesType } from '../components'
import { DeviceType } from '../device-type'
import { IconNamesList, TokenSymbolsList } from '../icons'
import { NetworkIds } from '../networks'
import {
  GetInterestRatesQuery,
  GetInterestRatesDocument,
} from '@summerfi/summer-earn-rates-subgraph'

export type { GetInterestRatesQuery }
export { GetInterestRatesDocument }
export type { IArmadaPosition as IArmadaPosition }
export type { IArmadaVaultInfo }

export type InterestRates = {
  [key: string]: GetInterestRatesQuery
}

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

export type SingleSourceChartData = {
  data: ChartsDataTimeframes
}

export type MultipleSourceChartData = {
  data: ChartsDataTimeframes
  dataNames: string[]
  colors: string[]
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

export type EarnTransactionViewStates =
  | 'idle'
  | 'loadingTx'
  | 'txPrepared'
  | 'txInProgress'
  | 'txError'
  | 'txSuccess'

export enum UiTransactionStatuses {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
export enum AuthorizedStakingRewardsCallerBaseStatus {
  NOAUTH = 'noauth',
  AUTHORIZED = 'authorized',
}

export enum UiSimpleFlowSteps {
  INIT = 'init',
  PENDING = 'pending',
  COMPLETED = 'completed',
  ERROR = 'error',
}

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
  pool?: string
  vault?: string
  chainId: number
}

export type GetInterestRatesParams = {
  network: SupportedSDKNetworks
  dailyCount?: number
  hourlyCount?: number
  weeklyCount?: number
  arksList: SDKVaultishType['arks'] | SDKVaultType['arks']
  justLatestRates?: boolean
  withCache?: boolean
}

export type PlatformLogo = 'aave' | 'spark' | 'morpho' | 'summer'

export type VaultApyData = {
  apy: number
  apyTimestamp: number | null
  sma24h: number | null
  sma7d: number | null
  sma30d: number | null
}

export type EarnProtocolDbNetwork =
  | 'arbitrum'
  | 'optimism'
  | 'base'
  | 'mainnet'
  | 'sonic'
  | 'hyperliquid'

// Define a new type for transactions that includes an `executed` property
export type TransactionWithStatus = (
  | ApproveTransactionInfo
  | DepositTransactionInfo
  | WithdrawTransactionInfo
  | VaultSwitchTransactionInfo
  | ClaimTransactionInfo
  | DelegateTransactionInfo
  | StakeTransactionInfo
  | UnstakeTransactionInfo
) & {
  executed: boolean
  txHash?: string
}

export type UserConfigResponse = {
  analyticsCookie: boolean
  deviceType: DeviceType
  sumrNetApyConfig: {
    enabled: boolean
    slippage: number
  }
  slippageConfig: {
    slippage: number
  }
  country: string | null
}

export type GetVaultsApyResponse = {
  // response {
  //   '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17-42161': {
  //     apy: 8.002220099969366,
  //     sma24h: 13.54019480114041,
  //     sma7d: 6.578848760141222,
  //     sma30d: 2.7373712017127283,
  //   },
  //   '0x98c49e13bf99d7cad8069faa2a370933ec9ecf17-8453': {
  //     apy: 13.54019480114041,
  //     sma24h: 13.54019480114041,
  //     sma7d: 6.578848760141222,
  //     sma30d: 2.7373712017127283,
  //   },
  // } etc
  // apy gets divided by 100 to not confuse the frontend
  [key: `${string}-${number}`]: VaultApyData
}

export const supportedDefillamaProtocolsConfig: {
  [key in SupportedDefillamaTvlProtocols]: {
    displayName: string
    defillamaProtocolName: string
    icon: IconNamesList
    asset: TokenSymbolsList[]
    strategy: string
  }
} = {
  aave: {
    displayName: 'Aave',
    defillamaProtocolName: 'aave-v3',
    icon: 'scroller_aave',
    asset: ['USDC', 'ETH'],
    strategy: 'Lending',
  },
  sky: {
    displayName: 'Sky',
    defillamaProtocolName: 'sky-lending',
    icon: 'scroller_sky',
    asset: ['USDC', 'ETH'],
    strategy: 'Lending',
  },
  spark: {
    displayName: 'Spark',
    defillamaProtocolName: 'spark',
    icon: 'scroller_spark',
    asset: ['USDC', 'ETH'],
    strategy: 'Lending',
  },
  gearbox: {
    displayName: 'Gearbox',
    defillamaProtocolName: 'gearbox',
    icon: 'scroller_gearbox',
    asset: ['USDC', 'ETH'],
    strategy: 'Lending',
  },
  euler: {
    displayName: 'Euler',
    defillamaProtocolName: 'euler',
    icon: 'scroller_euler',
    asset: ['USDC', 'ETH'],
    strategy: 'Lending',
  },
  compound: {
    displayName: 'Compound',
    defillamaProtocolName: 'compound-v3',
    icon: 'scroller_compound',
    asset: ['USDC', 'ETH'],
    strategy: 'Lending',
  },
  ethena: {
    displayName: 'Ethena',
    defillamaProtocolName: 'ethena',
    icon: 'scroller_ethena',
    asset: ['USDC', 'ETH'],
    strategy: 'Lending',
  },
  fluid: {
    displayName: 'Fluid',
    defillamaProtocolName: 'fluid-lending',
    icon: 'scroller_fluid',
    asset: ['USDC', 'ETH', 'EURC'],
    strategy: 'Lending',
  },
}

export const supportedDefillamaProtocols = Object.keys(
  supportedDefillamaProtocolsConfig,
) as (keyof typeof supportedDefillamaProtocolsConfig)[]

export type SupportedDefillamaTvlProtocols =
  | 'aave'
  | 'sky'
  | 'spark'
  | 'gearbox'
  | 'euler'
  | 'compound'
  | 'ethena'
  | 'fluid'

export type ProAppStats = {
  monthlyVolume: number
  managedOnOasis: number
  medianVaultSize: number
  vaultsWithActiveTrigger: number
  executedTriggersLast90Days: number
  lockedCollateralActiveTrigger: number
  triggersSuccessRate: number
}

export type TotalRebalanceItemsPerStrategyId = {
  strategyId: string
  count: number
}

export type LandingPageData = {
  systemConfig: EarnAppConfigType
  vaultsWithConfig: SDKVaultishType[]
  vaultsApyByNetworkMap: GetVaultsApyResponse
  protocolTvls: {
    [key in SupportedDefillamaTvlProtocols]: bigint
  }
  protocolApys: {
    [key in SupportedDefillamaTvlProtocols]: [number, number]
  }
  totalRebalanceItemsPerStrategyId: TotalRebalanceItemsPerStrategyId[]
  proAppStats: ProAppStats
  vaultsInfo: IArmadaVaultInfo[] | undefined
  totalUniqueUsers: number
  sumrPriceUsd: number
}

export enum SupportedNetworkIds {
  Mainnet = NetworkIds.MAINNET,
  Base = NetworkIds.BASEMAINNET,
  ArbitrumOne = NetworkIds.ARBITRUMMAINNET,
  SonicMainnet = NetworkIds.SONICMAINNET,
  Hyperliquid = NetworkIds.HYPERLIQUID,
}

export enum SupportedSDKNetworks {
  Mainnet = Network.Mainnet,
  Base = Network.Base,
  ArbitrumOne = Network.ArbitrumOne,
  SonicMainnet = Network.SonicMainnet,
  Hyperliquid = Network.Hyperevm,
}

export interface FleetRate {
  id: string
  rate: string
  timestamp: number
  fleetAddress: string
}

export interface AggregatedFleetRate {
  id: string
  averageRate: string
  date: string
  fleetAddress: string
}

export interface HistoricalFleetRates {
  dailyRates: AggregatedFleetRate[]
  hourlyRates: AggregatedFleetRate[]
  weeklyRates: AggregatedFleetRate[]
  latestRate: FleetRate[]
}

export interface HistoricalFleetRateResult {
  chainId: string
  fleetAddress: string
  rates: HistoricalFleetRates
}

export type GetVaultsApyParams = {
  fleets: {
    fleetAddress: string
    chainId: number
  }[]
}

export type GetVaultsApyRAWResponse = {
  rates: {
    chainId: number
    fleetAddress: string
    sma: {
      sma24h: string | null
      sma7d: string | null
      sma30d: string | null
    }
    rates: [
      {
        id: string
        rate: string
        timestamp: number
        fleetAddress: string
      },
    ]
  }[]
}
