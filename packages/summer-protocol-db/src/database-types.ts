import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>

export type Network = 'arbitrum' | 'base' | 'mainnet' | 'optimism' | 'sonic'

export type Numeric = ColumnType<string, number | string, number | string>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface DailyFleetInterestRate {
  averageRate: Numeric
  date: Int8
  fleetAddress: string
  id: string
  network: Network
  sumRates: Numeric
  updateCount: Int8
}

export interface DailyRewardRate {
  averageRate: Numeric
  date: Int8
  id: string
  network: Network
  productId: string
  protocol: string
  sumRates: Numeric
  updateCount: Int8
}

export interface FleetInterestRate {
  fleetAddress: string
  id: string
  network: Network
  rate: Numeric
  timestamp: Int8
}

export interface HourlyFleetInterestRate {
  averageRate: Numeric
  date: Int8
  fleetAddress: string
  id: string
  network: Network
  sumRates: Numeric
  updateCount: Int8
}

export interface HourlyRewardRate {
  averageRate: Numeric
  date: Int8
  id: string
  network: Network
  productId: string
  protocol: string
  sumRates: Numeric
  updateCount: Int8
}

export interface NetworkStatus {
  isUpdating: Generated<boolean>
  lastBlockNumber: Int8
  lastUpdatedAt: Int8
  network: Network
}

export interface RewardRate {
  id: string
  network: Network
  productId: string
  rate: Numeric
  rewardToken: string
  timestamp: Int8
}

export interface Token {
  address: string
  decimals: number
  network: Network
  precision: string
  symbol: string
}

export interface TosApproval {
  address: string
  chainId: Generated<number>
  docVersion: string
  message: Generated<string>
  signature: Generated<string>
  signDate: Timestamp
}

export interface WalletRisk {
  address: string
  isRisky: boolean
  lastCheck: Timestamp
}

export interface WeeklyFleetInterestRate {
  averageRate: Numeric
  fleetAddress: string
  id: string
  network: Network
  sumRates: Numeric
  updateCount: Int8
  weekTimestamp: Int8
}

export interface WeeklyRewardRate {
  averageRate: Numeric
  id: string
  network: Network
  productId: string
  protocol: string
  sumRates: Numeric
  updateCount: Int8
  weekTimestamp: Int8
}

export interface Database {
  dailyFleetInterestRate: DailyFleetInterestRate
  dailyRewardRate: DailyRewardRate
  fleetInterestRate: FleetInterestRate
  hourlyFleetInterestRate: HourlyFleetInterestRate
  hourlyRewardRate: HourlyRewardRate
  networkStatus: NetworkStatus
  rewardRate: RewardRate
  token: Token
  tosApproval: TosApproval
  walletRisk: WalletRisk
  weeklyFleetInterestRate: WeeklyFleetInterestRate
  weeklyRewardRate: WeeklyRewardRate
}
