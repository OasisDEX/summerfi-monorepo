import {
  Network,
  GetVaultsQuery,
  GetVaultQuery,
  GetGlobalRebalancesQuery,
  GetUsersActivityQuery,
} from '@summerfi/subgraph-manager-common'
import {
  ExtendedTransactionInfo,
  IArmadaPosition,
  VaultSwitchTransactionInfo,
} from '@summerfi/sdk-common'
import { ChainId } from '@summerfi/serverless-shared'
import { EarnAppConfigType, EarnAppFleetCustomConfigType } from '../generated/earn-app-config'
import { TimeframesType } from '../components'
import { DeviceType } from 'types/src/device-type'
import { IconNamesList } from 'types/src/icons'

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

// Define a new type for transactions that includes an `executed` property
export type TransactionWithStatus = (ExtendedTransactionInfo | VaultSwitchTransactionInfo) & {
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
  }
} = {
  aave: {
    displayName: 'Aave',
    defillamaProtocolName: 'aave',
    icon: 'scroller_aave',
  },
  sky: {
    displayName: 'Sky',
    defillamaProtocolName: 'sky',
    icon: 'scroller_sky',
  },
  spark: {
    displayName: 'Spark',
    defillamaProtocolName: 'spark',
    icon: 'scroller_spark',
  },
  pendle: {
    displayName: 'Pendle',
    defillamaProtocolName: 'pendle',
    icon: 'scroller_pendle',
  },
  gearbox: {
    displayName: 'Gearbox',
    defillamaProtocolName: 'gearbox',
    icon: 'scroller_gearbox',
  },
  euler: {
    displayName: 'Euler',
    defillamaProtocolName: 'euler',
    icon: 'scroller_euler',
  },
  compound: {
    displayName: 'Compound',
    defillamaProtocolName: 'compound-v3',
    icon: 'scroller_compound',
  },
  ethena: {
    displayName: 'Ethena',
    defillamaProtocolName: 'ethena',
    icon: 'scroller_ethena',
  },
  fluid: {
    displayName: 'Fluid',
    defillamaProtocolName: 'fluid-lending',
    icon: 'scroller_fluid',
  },
}

export const supportedDefillamaProtocols = Object.keys(
  supportedDefillamaProtocolsConfig,
) as (keyof typeof supportedDefillamaProtocolsConfig)[]

export type SupportedDefillamaTvlProtocols =
  | 'aave'
  | 'sky'
  | 'spark'
  | 'pendle'
  | 'gearbox'
  | 'euler'
  | 'compound'
  | 'ethena'
  | 'fluid'

export type LandingPageData = {
  systemConfig: EarnAppConfigType
  vaultsWithConfig: SDKVaultishType[]
  vaultsApyByNetworkMap: GetVaultsApyResponse
  protocolTvls: {
    [key in SupportedDefillamaTvlProtocols]: bigint
  }
}
