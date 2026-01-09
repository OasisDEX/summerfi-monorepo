import type { ColumnType } from "kysely";

export type ActionType = "deposit" | "withdraw";

export type CampaignType = "okx";

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

export type Network = "arbitrum" | "base" | "hyperliquid" | "mainnet" | "optimism" | "sonic";

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Campaigns {
  campaign: CampaignType;
  id: Generated<number>;
  timestamp: Int8;
  userAddress: string;
}

export interface DailyFleetInterestRate {
  averageRate: Numeric;
  date: Int8;
  fleetAddress: string;
  id: string;
  network: Network;
  sumRates: Numeric;
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

export interface FleetInterestRate {
  fleetAddress: string;
  id: string;
  network: Network;
  rate: Numeric;
  timestamp: Int8;
}

export interface HourlyFleetInterestRate {
  averageRate: Numeric;
  date: Int8;
  fleetAddress: string;
  id: string;
  network: Network;
  sumRates: Numeric;
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

export interface LatestActivity {
  actionType: ActionType;
  amount: Numeric;
  amountNormalized: Numeric;
  amountUsd: Numeric;
  balance: Numeric;
  balanceNormalized: Numeric;
  balanceUsd: Numeric;
  id: string;
  inputTokenDecimals: Int8;
  inputTokenPriceUsd: Numeric;
  inputTokenSymbol: string;
  network: Network;
  strategy: string;
  strategyId: string;
  timestamp: Int8;
  txHash: string;
  userAddress: string;
  vaultId: string;
  vaultName: string;
}

export interface NetworkStatus {
  isUpdating: Generated<boolean>;
  lastBlockNumber: Int8;
  lastUpdatedAt: Int8;
  network: Network;
}

export interface RebalanceActivity {
  actionType: string;
  amount: Numeric;
  amountNormalized: Numeric;
  amountUsd: Numeric;
  fromDepositLimit: Numeric;
  fromDepositLimitNormalized: Numeric;
  fromName: string;
  fromTotalValueLockedUsd: Numeric;
  id: string;
  inputTokenDecimals: Int8;
  inputTokenPriceUsd: Numeric;
  inputTokenSymbol: string;
  network: Network;
  rebalanceId: string;
  strategy: string;
  strategyId: string;
  timestamp: Int8;
  toDepositLimit: Numeric;
  toDepositLimitNormalized: Numeric;
  toName: string;
  toTotalValueLockedUsd: Numeric;
  txHash: string;
  vaultId: string;
  vaultName: string;
}

export interface RewardRate {
  id: string;
  network: Network;
  productId: string;
  rate: Numeric;
  rewardToken: string;
  timestamp: Int8;
}

export interface TallyDelegates {
  bio: Generated<string>;
  customBio: Generated<string>;
  customTitle: Generated<string>;
  delegatorsCount: Numeric;
  displayName: Generated<string>;
  ens: Generated<string>;
  forumUrl: Generated<string>;
  photo: Generated<string>;
  updatedAt: Generated<Int8>;
  userAddress: string;
  votePower: Numeric;
  votesCount: Numeric;
  votesCountNormalized: Numeric;
  x: Generated<string>;
}

export interface TallyDelegatesV2 {
  bio: Generated<string>;
  customBio: Generated<string>;
  customTitle: Generated<string>;
  delegatorsCount: Numeric;
  displayName: Generated<string>;
  ens: Generated<string>;
  forumUrl: Generated<string>;
  photo: Generated<string>;
  updatedAt: Generated<Int8>;
  userAddress: string;
  votePower: Numeric;
  votesCount: Numeric;
  votesCountNormalized: Numeric;
  x: Generated<string>;
}

export interface Token {
  address: string;
  decimals: number;
  network: Network;
  precision: string;
  symbol: string;
}

export interface TopDepositors {
  balance: Numeric;
  balanceNormalized: Numeric;
  balanceUsd: Numeric;
  changeSevenDays: Numeric;
  earningsStreak: Int8;
  id: string;
  inputTokenDecimals: Int8;
  inputTokenPriceUsd: Numeric;
  inputTokenSymbol: string;
  network: Network;
  noOfDeposits: Int8;
  noOfWithdrawals: Int8;
  projectedOneYearEarnings: Numeric;
  projectedOneYearEarningsUsd: Numeric;
  strategy: string;
  strategyId: string;
  updatedAt: Int8;
  userAddress: string;
  vaultId: string;
  vaultName: string;
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

export interface WeeklyFleetInterestRate {
  averageRate: Numeric;
  fleetAddress: string;
  id: string;
  network: Network;
  sumRates: Numeric;
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

export interface YieldRaceGames {
  gameId: string;
  gamesPlayed: Generated<number>;
  responseTimes: Json | null;
  score: Generated<Int8>;
  timestampEnd: Generated<Int8>;
  timestampStart: Generated<Int8>;
  updatedAt: Generated<Int8>;
  userAddress: string;
}

export interface YieldRaceLeaderboard {
  ens: Generated<string>;
  gameId: string;
  isBanned: Generated<boolean>;
  responseTimes: Json;
  score: Generated<Int8>;
  signedMessage: string;
  updatedAt: Generated<Int8>;
  userAddress: string;
}

export interface Database {
  campaigns: Campaigns;
  dailyFleetInterestRate: DailyFleetInterestRate;
  dailyRewardRate: DailyRewardRate;
  fleetInterestRate: FleetInterestRate;
  hourlyFleetInterestRate: HourlyFleetInterestRate;
  hourlyRewardRate: HourlyRewardRate;
  latestActivity: LatestActivity;
  networkStatus: NetworkStatus;
  rebalanceActivity: RebalanceActivity;
  rewardRate: RewardRate;
  tallyDelegates: TallyDelegates;
  tallyDelegatesV2: TallyDelegatesV2;
  token: Token;
  topDepositors: TopDepositors;
  tosApproval: TosApproval;
  walletRisk: WalletRisk;
  weeklyFleetInterestRate: WeeklyFleetInterestRate;
  weeklyRewardRate: WeeklyRewardRate;
  yieldRaceGames: YieldRaceGames;
  yieldRaceLeaderboard: YieldRaceLeaderboard;
}
