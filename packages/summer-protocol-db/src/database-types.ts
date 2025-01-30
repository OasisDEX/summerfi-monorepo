import type { ColumnType } from "kysely";

export type ArrayType<T> = ArrayTypeImpl<T> extends (infer U)[]
  ? U[]
  : ArrayTypeImpl<T>;

export type ArrayTypeImpl<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S[], I[], U[]>
  : T[];

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Network = "arbitrum" | "base" | "mainnet" | "optimism";

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface DailyInterestRate {
  averageRate: Numeric;
  date: Int8;
  id: string;
  nativeRate: Numeric;
  network: Network;
  productId: string;
  protocol: string;
  rewardsRate: Numeric;
  sumRates: Numeric;
  token: string;
  updateCount: Int8;
}

export interface DailyRewardRate {
  averageRate: Numeric;
  date: Int8;
  id: string;
  network: Network;
  productId: string;
  protocol: string;
  sumRates: Numeric;
  updateCount: Int8;
}

export interface HourlyInterestRate {
  averageRate: Numeric;
  date: Int8;
  id: string;
  nativeRate: Numeric;
  network: Network;
  productId: string;
  protocol: string;
  rewardsRate: Numeric;
  sumRates: Numeric;
  token: string;
  updateCount: Int8;
}

export interface HourlyRewardRate {
  averageRate: Numeric;
  date: Int8;
  id: string;
  network: Network;
  productId: string;
  protocol: string;
  sumRates: Numeric;
  updateCount: Int8;
}

export interface InterestRate {
  blockNumber: Int8;
  dailyRateId: string;
  hourlyRateId: string;
  id: string;
  nativeRate: Numeric;
  network: Network;
  productId: string;
  protocol: string;
  rate: Numeric;
  rewardsRate: Numeric;
  timestamp: Int8;
  token: string;
  type: string;
  weeklyRateId: string;
}

export interface InterestRateRewards {
  interestRateId: string;
  rewardRateId: string;
}

export interface InterestRateWithRewards {
  blockNumber: Int8 | null;
  dailyRateId: string | null;
  hourlyRateId: string | null;
  id: string | null;
  nativeRate: Numeric | null;
  network: Network | null;
  productId: string | null;
  protocol: string | null;
  rate: Numeric | null;
  rewardRates: ArrayType<Json> | null;
  rewardsRate: Numeric | null;
  timestamp: Int8 | null;
  token: string | null;
  type: string | null;
  weeklyRateId: string | null;
}

export interface NetworkStatus {
  isUpdating: Generated<boolean>;
  lastBlockNumber: Int8;
  lastUpdatedAt: Int8;
  network: Network;
}

export interface RewardRate {
  id: string;
  network: Network;
  productId: string;
  rate: Numeric;
  rewardToken: string;
  timestamp: Int8;
}

export interface Token {
  address: string;
  decimals: number;
  network: Network;
  precision: number;
  symbol: string;
}

export interface TosApproval {
  address: string;
  chainId: Generated<number>;
  docVersion: string;
  message: Generated<string>;
  signature: Generated<string>;
  signDate: Timestamp;
}

export interface WalletRisk {
  address: string;
  isRisky: boolean;
  lastCheck: Timestamp;
}

export interface WeeklyInterestRate {
  averageRate: Numeric;
  id: string;
  nativeRate: Numeric;
  network: Network;
  productId: string;
  protocol: string;
  rewardsRate: Numeric;
  sumRates: Numeric;
  token: string;
  updateCount: Int8;
  weekTimestamp: Int8;
}

export interface WeeklyRewardRate {
  averageRate: Numeric;
  id: string;
  network: Network;
  productId: string;
  protocol: string;
  sumRates: Numeric;
  updateCount: Int8;
  weekTimestamp: Int8;
}

export interface Database {
  dailyInterestRate: DailyInterestRate;
  dailyRewardRate: DailyRewardRate;
  hourlyInterestRate: HourlyInterestRate;
  hourlyRewardRate: HourlyRewardRate;
  interestRate: InterestRate;
  interestRateRewards: InterestRateRewards;
  interestRateWithRewards: InterestRateWithRewards;
  networkStatus: NetworkStatus;
  rewardRate: RewardRate;
  token: Token;
  tosApproval: TosApproval;
  walletRisk: WalletRisk;
  weeklyInterestRate: WeeklyInterestRate;
  weeklyRewardRate: WeeklyRewardRate;
}
