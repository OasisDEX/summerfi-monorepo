// This file was automatically generated and should not be edited.
// @ts-nocheck
/* eslint-disable */
import type { DocumentNode } from "graphql/language/ast";
import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: string; output: string; }
  BigInt: { input: bigint; output: bigint; }
  Bytes: { input: string; output: string; }
  Int8: { input: number; output: number; }
  Timestamp: { input: number; output: number; }
};

export type Account = {
  __typename?: 'Account';
  /**  deprecated  */
  claimedSummerToken: Scalars['BigInt']['output'];
  claimedSummerTokenNormalized: Scalars['BigDecimal']['output'];
  /**  Address of the account  */
  id: Scalars['ID']['output'];
  lastUpdateBlock: Scalars['BigInt']['output'];
  positions: Array<Position>;
  rewards: Array<AccountRewards>;
  stakedSummerToken: Scalars['BigInt']['output'];
  stakedSummerTokenNormalized: Scalars['BigDecimal']['output'];
};


export type AccountPositionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Position_Filter>;
};


export type AccountRewardsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountRewards_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccountRewards_Filter>;
};

export type AccountRewards = {
  __typename?: 'AccountRewards';
  account: Account;
  claimable: Scalars['BigInt']['output'];
  claimableNormalized: Scalars['BigDecimal']['output'];
  claimed: Scalars['BigInt']['output'];
  claimedNormalized: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  rewardToken: Token;
};

export type AccountRewards_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<AccountRewards_Filter>>>;
  claimable?: InputMaybe<Scalars['BigInt']['input']>;
  claimableNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimableNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimable_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimable_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimed?: InputMaybe<Scalars['BigInt']['input']>;
  claimedNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimedNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccountRewards_Filter>>>;
  rewardToken?: InputMaybe<Scalars['String']['input']>;
  rewardToken_?: InputMaybe<Token_Filter>;
  rewardToken_contains?: InputMaybe<Scalars['String']['input']>;
  rewardToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_gt?: InputMaybe<Scalars['String']['input']>;
  rewardToken_gte?: InputMaybe<Scalars['String']['input']>;
  rewardToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardToken_lt?: InputMaybe<Scalars['String']['input']>;
  rewardToken_lte?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum AccountRewards_OrderBy {
  Account = 'account',
  AccountClaimedSummerToken = 'account__claimedSummerToken',
  AccountClaimedSummerTokenNormalized = 'account__claimedSummerTokenNormalized',
  AccountId = 'account__id',
  AccountLastUpdateBlock = 'account__lastUpdateBlock',
  AccountStakedSummerToken = 'account__stakedSummerToken',
  AccountStakedSummerTokenNormalized = 'account__stakedSummerTokenNormalized',
  Claimable = 'claimable',
  ClaimableNormalized = 'claimableNormalized',
  Claimed = 'claimed',
  ClaimedNormalized = 'claimedNormalized',
  Id = 'id',
  RewardToken = 'rewardToken',
  RewardTokenDecimals = 'rewardToken__decimals',
  RewardTokenId = 'rewardToken__id',
  RewardTokenLastPriceBlockNumber = 'rewardToken__lastPriceBlockNumber',
  RewardTokenLastPriceUsd = 'rewardToken__lastPriceUSD',
  RewardTokenName = 'rewardToken__name',
  RewardTokenSymbol = 'rewardToken__symbol'
}

export type Account_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  claimedSummerToken?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerTokenNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimedSummerTokenNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimedSummerToken_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimedSummerToken_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastUpdateBlock?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Account_Filter>>>;
  positions_?: InputMaybe<Position_Filter>;
  rewards_?: InputMaybe<AccountRewards_Filter>;
  stakedSummerToken?: InputMaybe<Scalars['BigInt']['input']>;
  stakedSummerTokenNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSummerTokenNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSummerTokenNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSummerTokenNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedSummerTokenNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSummerTokenNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSummerTokenNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSummerTokenNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedSummerToken_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedSummerToken_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedSummerToken_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedSummerToken_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedSummerToken_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedSummerToken_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedSummerToken_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Account_OrderBy {
  ClaimedSummerToken = 'claimedSummerToken',
  ClaimedSummerTokenNormalized = 'claimedSummerTokenNormalized',
  Id = 'id',
  LastUpdateBlock = 'lastUpdateBlock',
  Positions = 'positions',
  Rewards = 'rewards',
  StakedSummerToken = 'stakedSummerToken',
  StakedSummerTokenNormalized = 'stakedSummerTokenNormalized'
}

export type ActiveAccount = {
  __typename?: 'ActiveAccount';
  /**  { daily/hourly }-{ Address of the account }-{ Days/hours since Unix epoch }  */
  id: Scalars['ID']['output'];
};

export type ActiveAccount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ActiveAccount_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ActiveAccount_Filter>>>;
};

export enum ActiveAccount_OrderBy {
  Id = 'id'
}

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type Ark = {
  __typename?: 'Ark';
  /**  Cumulative deposits since last update [ helper field ]  */
  _cumulativeDeposits: Scalars['BigInt']['output'];
  /**  Cumulative withdrawals since last update [ helper field ]  */
  _cumulativeWithdrawals: Scalars['BigInt']['output'];
  /**  Last update input token balance [ helper field ]  */
  _lastUpdateInputTokenBalance: Scalars['BigInt']['output'];
  actionSnapshots: Array<PostActionArkSnapshot>;
  /**  All deposits made to this vault  */
  boards: Array<Board>;
  /**  Calculated APR based on earnings between updates  */
  calculatedApr: Scalars['BigDecimal']['output'];
  /**  Creation block number  */
  createdBlockNumber: Scalars['BigInt']['output'];
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt']['output'];
  /**  Cumulative earnings of the Ark  */
  cumulativeEarnings: Scalars['BigInt']['output'];
  /**  All revenue generated by the vault, accrued to the protocol.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault, accrued to the supply side.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Vault daily snapshots  */
  dailySnapshots: Array<ArkDailySnapshot>;
  /**  Arks have a deposit cap. This is in input token amount  */
  depositCap: Scalars['BigInt']['output'];
  /**  DEPRECATED (use depositCap instead): Arks have a deposit cap. This is in input token amount  */
  depositLimit: Scalars['BigInt']['output'];
  /**  Details of the ark  */
  details?: Maybe<Scalars['String']['output']>;
  /**  All withdrawals made from this vault  */
  disembarks: Array<Disembark>;
  /**  Vault hourly snapshots  */
  hourlySnapshots: Array<ArkHourlySnapshot>;
  /**  Smart contract address of the vault  */
  id: Scalars['ID']['output'];
  /**  Token that need to be deposited to take a position in protocol  */
  inputToken: Token;
  /**  Current total assets in the Ark  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Last update timestamp  */
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /**  Arks have a maximum deposit percentage of TVL. This is a percentage (100 = 100%)  */
  maxDepositPercentageOfTVL: Scalars['BigInt']['output'];
  /**  Arks have a maximum inflow limit for the Ark during rebalancing. This is in input token amount  */
  maxRebalanceInflow: Scalars['BigInt']['output'];
  /**  Arks have a maximum outflow limit for the Ark during rebalancing. This is in input token amount  */
  maxRebalanceOutflow: Scalars['BigInt']['output'];
  /**  Name of liquidity pool (e.g. Curve.fi DAI/USDC/USDT)  */
  name?: Maybe<Scalars['String']['output']>;
  /**  Product ID of the ark  */
  productId: Scalars['String']['output'];
  rebalancesFrom: Array<Rebalance>;
  rebalancesTo: Array<Rebalance>;
  /**  Arks require keeper data to board/disembark if true  */
  requiresKeeperData: Scalars['Boolean']['output'];
  /**  Per-block reward token emission as of the current block normalized to a day, in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmount?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Per-block reward token emission as of the current block normalized to a day, in USD value. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsUSD?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /**  Aditional tokens that are given as reward for position in a protocol, usually in liquidity mining programs. e.g. SUSHI in the Onsen program, MATIC for Aave Polygon  */
  rewardTokens?: Maybe<Array<RewardToken>>;
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The protocol this vault belongs to  */
  vault: Vault;
};


export type ArkActionSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PostActionArkSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PostActionArkSnapshot_Filter>;
};


export type ArkBoardsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Board_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Board_Filter>;
};


export type ArkDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ArkDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArkDailySnapshot_Filter>;
};


export type ArkDisembarksArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Disembark_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Disembark_Filter>;
};


export type ArkHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ArkHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ArkHourlySnapshot_Filter>;
};


export type ArkRebalancesFromArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Rebalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Rebalance_Filter>;
};


export type ArkRebalancesToArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Rebalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Rebalance_Filter>;
};


export type ArkRewardTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RewardToken_Filter>;
};

export type ArkDailySnapshot = {
  __typename?: 'ArkDailySnapshot';
  /**  APR based on last day's revenue  */
  apr: Scalars['BigDecimal']['output'];
  /**  The ark this snapshot belongs to  */
  ark: Ark;
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  { Smart contract address of the vault }-{ # of days since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the pool  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  The protocol this snapshot belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The vault this snapshot belongs to  */
  vault: Vault;
};

export type ArkDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ArkDailySnapshot_Filter>>>;
  apr?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  ark?: InputMaybe<Scalars['String']['input']>;
  ark_?: InputMaybe<Ark_Filter>;
  ark_contains?: InputMaybe<Scalars['String']['input']>;
  ark_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_gt?: InputMaybe<Scalars['String']['input']>;
  ark_gte?: InputMaybe<Scalars['String']['input']>;
  ark_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_lt?: InputMaybe<Scalars['String']['input']>;
  ark_lte?: InputMaybe<Scalars['String']['input']>;
  ark_not?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ArkDailySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum ArkDailySnapshot_OrderBy {
  Apr = 'apr',
  Ark = 'ark',
  ArkCumulativeDeposits = 'ark___cumulativeDeposits',
  ArkCumulativeWithdrawals = 'ark___cumulativeWithdrawals',
  ArkLastUpdateInputTokenBalance = 'ark___lastUpdateInputTokenBalance',
  ArkCalculatedApr = 'ark__calculatedApr',
  ArkCreatedBlockNumber = 'ark__createdBlockNumber',
  ArkCreatedTimestamp = 'ark__createdTimestamp',
  ArkCumulativeEarnings = 'ark__cumulativeEarnings',
  ArkCumulativeProtocolSideRevenueUsd = 'ark__cumulativeProtocolSideRevenueUSD',
  ArkCumulativeSupplySideRevenueUsd = 'ark__cumulativeSupplySideRevenueUSD',
  ArkCumulativeTotalRevenueUsd = 'ark__cumulativeTotalRevenueUSD',
  ArkDepositCap = 'ark__depositCap',
  ArkDepositLimit = 'ark__depositLimit',
  ArkDetails = 'ark__details',
  ArkId = 'ark__id',
  ArkInputTokenBalance = 'ark__inputTokenBalance',
  ArkLastUpdateTimestamp = 'ark__lastUpdateTimestamp',
  ArkMaxDepositPercentageOfTvl = 'ark__maxDepositPercentageOfTVL',
  ArkMaxRebalanceInflow = 'ark__maxRebalanceInflow',
  ArkMaxRebalanceOutflow = 'ark__maxRebalanceOutflow',
  ArkName = 'ark__name',
  ArkProductId = 'ark__productId',
  ArkRequiresKeeperData = 'ark__requiresKeeperData',
  ArkTotalValueLockedUsd = 'ark__totalValueLockedUSD',
  BlockNumber = 'blockNumber',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type ArkHourlySnapshot = {
  __typename?: 'ArkHourlySnapshot';
  /**  The ark this snapshot belongs to  */
  ark: Ark;
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  APR based on last hour's revenue  */
  calculatedApr: Scalars['BigDecimal']['output'];
  /**  { Smart contract address of the vault }-{ # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the pool  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  The protocol this snapshot belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The vault this snapshot belongs to  */
  vault: Vault;
};

export type ArkHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ArkHourlySnapshot_Filter>>>;
  ark?: InputMaybe<Scalars['String']['input']>;
  ark_?: InputMaybe<Ark_Filter>;
  ark_contains?: InputMaybe<Scalars['String']['input']>;
  ark_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_gt?: InputMaybe<Scalars['String']['input']>;
  ark_gte?: InputMaybe<Scalars['String']['input']>;
  ark_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_lt?: InputMaybe<Scalars['String']['input']>;
  ark_lte?: InputMaybe<Scalars['String']['input']>;
  ark_not?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  calculatedApr?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  calculatedApr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ArkHourlySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum ArkHourlySnapshot_OrderBy {
  Ark = 'ark',
  ArkCumulativeDeposits = 'ark___cumulativeDeposits',
  ArkCumulativeWithdrawals = 'ark___cumulativeWithdrawals',
  ArkLastUpdateInputTokenBalance = 'ark___lastUpdateInputTokenBalance',
  ArkCalculatedApr = 'ark__calculatedApr',
  ArkCreatedBlockNumber = 'ark__createdBlockNumber',
  ArkCreatedTimestamp = 'ark__createdTimestamp',
  ArkCumulativeEarnings = 'ark__cumulativeEarnings',
  ArkCumulativeProtocolSideRevenueUsd = 'ark__cumulativeProtocolSideRevenueUSD',
  ArkCumulativeSupplySideRevenueUsd = 'ark__cumulativeSupplySideRevenueUSD',
  ArkCumulativeTotalRevenueUsd = 'ark__cumulativeTotalRevenueUSD',
  ArkDepositCap = 'ark__depositCap',
  ArkDepositLimit = 'ark__depositLimit',
  ArkDetails = 'ark__details',
  ArkId = 'ark__id',
  ArkInputTokenBalance = 'ark__inputTokenBalance',
  ArkLastUpdateTimestamp = 'ark__lastUpdateTimestamp',
  ArkMaxDepositPercentageOfTvl = 'ark__maxDepositPercentageOfTVL',
  ArkMaxRebalanceInflow = 'ark__maxRebalanceInflow',
  ArkMaxRebalanceOutflow = 'ark__maxRebalanceOutflow',
  ArkName = 'ark__name',
  ArkProductId = 'ark__productId',
  ArkRequiresKeeperData = 'ark__requiresKeeperData',
  ArkTotalValueLockedUsd = 'ark__totalValueLockedUSD',
  BlockNumber = 'blockNumber',
  CalculatedApr = 'calculatedApr',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type Ark_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  _cumulativeDeposits?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeDeposits_gt?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeDeposits_gte?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeDeposits_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  _cumulativeDeposits_lt?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeDeposits_lte?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeDeposits_not?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  _cumulativeWithdrawals?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeWithdrawals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeWithdrawals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeWithdrawals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  _cumulativeWithdrawals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeWithdrawals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeWithdrawals_not?: InputMaybe<Scalars['BigInt']['input']>;
  _cumulativeWithdrawals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  _lastUpdateInputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  _lastUpdateInputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  _lastUpdateInputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  _lastUpdateInputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  _lastUpdateInputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  _lastUpdateInputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  _lastUpdateInputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  _lastUpdateInputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  actionSnapshots_?: InputMaybe<PostActionArkSnapshot_Filter>;
  and?: InputMaybe<Array<InputMaybe<Ark_Filter>>>;
  boards_?: InputMaybe<Board_Filter>;
  calculatedApr?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  calculatedApr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeEarnings?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarnings_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarnings_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarnings_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeEarnings_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarnings_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarnings_not?: InputMaybe<Scalars['BigInt']['input']>;
  cumulativeEarnings_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySnapshots_?: InputMaybe<ArkDailySnapshot_Filter>;
  depositCap?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositCap_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositLimit?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  details?: InputMaybe<Scalars['String']['input']>;
  details_contains?: InputMaybe<Scalars['String']['input']>;
  details_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  details_ends_with?: InputMaybe<Scalars['String']['input']>;
  details_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  details_gt?: InputMaybe<Scalars['String']['input']>;
  details_gte?: InputMaybe<Scalars['String']['input']>;
  details_in?: InputMaybe<Array<Scalars['String']['input']>>;
  details_lt?: InputMaybe<Scalars['String']['input']>;
  details_lte?: InputMaybe<Scalars['String']['input']>;
  details_not?: InputMaybe<Scalars['String']['input']>;
  details_not_contains?: InputMaybe<Scalars['String']['input']>;
  details_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  details_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  details_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  details_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  details_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  details_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  details_starts_with?: InputMaybe<Scalars['String']['input']>;
  details_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  disembarks_?: InputMaybe<Disembark_Filter>;
  hourlySnapshots_?: InputMaybe<ArkHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputToken?: InputMaybe<Scalars['String']['input']>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputToken_?: InputMaybe<Token_Filter>;
  inputToken_contains?: InputMaybe<Scalars['String']['input']>;
  inputToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  inputToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_gt?: InputMaybe<Scalars['String']['input']>;
  inputToken_gte?: InputMaybe<Scalars['String']['input']>;
  inputToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  inputToken_lt?: InputMaybe<Scalars['String']['input']>;
  inputToken_lte?: InputMaybe<Scalars['String']['input']>;
  inputToken_not?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  inputToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  inputToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxDepositPercentageOfTVL?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositPercentageOfTVL_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositPercentageOfTVL_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositPercentageOfTVL_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxDepositPercentageOfTVL_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositPercentageOfTVL_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositPercentageOfTVL_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxDepositPercentageOfTVL_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxRebalanceInflow?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceInflow_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceInflow_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceInflow_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxRebalanceInflow_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceInflow_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceInflow_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceInflow_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxRebalanceOutflow?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOutflow_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOutflow_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOutflow_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxRebalanceOutflow_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOutflow_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOutflow_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOutflow_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Ark_Filter>>>;
  productId?: InputMaybe<Scalars['String']['input']>;
  productId_contains?: InputMaybe<Scalars['String']['input']>;
  productId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  productId_ends_with?: InputMaybe<Scalars['String']['input']>;
  productId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  productId_gt?: InputMaybe<Scalars['String']['input']>;
  productId_gte?: InputMaybe<Scalars['String']['input']>;
  productId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  productId_lt?: InputMaybe<Scalars['String']['input']>;
  productId_lte?: InputMaybe<Scalars['String']['input']>;
  productId_not?: InputMaybe<Scalars['String']['input']>;
  productId_not_contains?: InputMaybe<Scalars['String']['input']>;
  productId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  productId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  productId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  productId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  productId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  productId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  productId_starts_with?: InputMaybe<Scalars['String']['input']>;
  productId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rebalancesFrom_?: InputMaybe<Rebalance_Filter>;
  rebalancesTo_?: InputMaybe<Rebalance_Filter>;
  requiresKeeperData?: InputMaybe<Scalars['Boolean']['input']>;
  requiresKeeperData_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  requiresKeeperData_not?: InputMaybe<Scalars['Boolean']['input']>;
  requiresKeeperData_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  rewardTokenEmissionsAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokens?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_?: InputMaybe<RewardToken_Filter>;
  rewardTokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Ark_OrderBy {
  CumulativeDeposits = '_cumulativeDeposits',
  CumulativeWithdrawals = '_cumulativeWithdrawals',
  LastUpdateInputTokenBalance = '_lastUpdateInputTokenBalance',
  ActionSnapshots = 'actionSnapshots',
  Boards = 'boards',
  CalculatedApr = 'calculatedApr',
  CreatedBlockNumber = 'createdBlockNumber',
  CreatedTimestamp = 'createdTimestamp',
  CumulativeEarnings = 'cumulativeEarnings',
  CumulativeProtocolSideRevenueUsd = 'cumulativeProtocolSideRevenueUSD',
  CumulativeSupplySideRevenueUsd = 'cumulativeSupplySideRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  DailySnapshots = 'dailySnapshots',
  DepositCap = 'depositCap',
  DepositLimit = 'depositLimit',
  Details = 'details',
  Disembarks = 'disembarks',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  InputToken = 'inputToken',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenDecimals = 'inputToken__decimals',
  InputTokenId = 'inputToken__id',
  InputTokenLastPriceBlockNumber = 'inputToken__lastPriceBlockNumber',
  InputTokenLastPriceUsd = 'inputToken__lastPriceUSD',
  InputTokenName = 'inputToken__name',
  InputTokenSymbol = 'inputToken__symbol',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  MaxDepositPercentageOfTvl = 'maxDepositPercentageOfTVL',
  MaxRebalanceInflow = 'maxRebalanceInflow',
  MaxRebalanceOutflow = 'maxRebalanceOutflow',
  Name = 'name',
  ProductId = 'productId',
  RebalancesFrom = 'rebalancesFrom',
  RebalancesTo = 'rebalancesTo',
  RequiresKeeperData = 'requiresKeeperData',
  RewardTokenEmissionsAmount = 'rewardTokenEmissionsAmount',
  RewardTokenEmissionsUsd = 'rewardTokenEmissionsUSD',
  RewardTokens = 'rewardTokens',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Board = Event & {
  __typename?: 'Board';
  /**  Amount of token deposited in native units  */
  amount: Scalars['BigInt']['output'];
  /**  Amount of token deposited in USD  */
  amountUSD: Scalars['BigDecimal']['output'];
  ark: Ark;
  /**  Token deposited  */
  asset: Token;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Address that deposited tokens  */
  from: Scalars['String']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  The protocol this transaction belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Market that tokens are deposited into  */
  to: Scalars['String']['output'];
  /**  The vault involving this transaction  */
  vault: Vault;
};

export type Board_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Board_Filter>>>;
  ark?: InputMaybe<Scalars['String']['input']>;
  ark_?: InputMaybe<Ark_Filter>;
  ark_contains?: InputMaybe<Scalars['String']['input']>;
  ark_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_gt?: InputMaybe<Scalars['String']['input']>;
  ark_gte?: InputMaybe<Scalars['String']['input']>;
  ark_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_lt?: InputMaybe<Scalars['String']['input']>;
  ark_lte?: InputMaybe<Scalars['String']['input']>;
  ark_not?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Token_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Board_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Board_OrderBy {
  Amount = 'amount',
  AmountUsd = 'amountUSD',
  Ark = 'ark',
  ArkCumulativeDeposits = 'ark___cumulativeDeposits',
  ArkCumulativeWithdrawals = 'ark___cumulativeWithdrawals',
  ArkLastUpdateInputTokenBalance = 'ark___lastUpdateInputTokenBalance',
  ArkCalculatedApr = 'ark__calculatedApr',
  ArkCreatedBlockNumber = 'ark__createdBlockNumber',
  ArkCreatedTimestamp = 'ark__createdTimestamp',
  ArkCumulativeEarnings = 'ark__cumulativeEarnings',
  ArkCumulativeProtocolSideRevenueUsd = 'ark__cumulativeProtocolSideRevenueUSD',
  ArkCumulativeSupplySideRevenueUsd = 'ark__cumulativeSupplySideRevenueUSD',
  ArkCumulativeTotalRevenueUsd = 'ark__cumulativeTotalRevenueUSD',
  ArkDepositCap = 'ark__depositCap',
  ArkDepositLimit = 'ark__depositLimit',
  ArkDetails = 'ark__details',
  ArkId = 'ark__id',
  ArkInputTokenBalance = 'ark__inputTokenBalance',
  ArkLastUpdateTimestamp = 'ark__lastUpdateTimestamp',
  ArkMaxDepositPercentageOfTvl = 'ark__maxDepositPercentageOfTVL',
  ArkMaxRebalanceInflow = 'ark__maxRebalanceInflow',
  ArkMaxRebalanceOutflow = 'ark__maxRebalanceOutflow',
  ArkName = 'ark__name',
  ArkProductId = 'ark__productId',
  ArkRequiresKeeperData = 'ark__requiresKeeperData',
  ArkTotalValueLockedUsd = 'ark__totalValueLockedUSD',
  Asset = 'asset',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLastPriceBlockNumber = 'asset__lastPriceBlockNumber',
  AssetLastPriceUsd = 'asset__lastPriceUSD',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  BlockNumber = 'blockNumber',
  From = 'from',
  Hash = 'hash',
  Id = 'id',
  LogIndex = 'logIndex',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  To = 'to',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type DailyInterestRate = {
  __typename?: 'DailyInterestRate';
  averageRate: Scalars['BigDecimal']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  sumRates: Scalars['BigDecimal']['output'];
  updateCount: Scalars['BigInt']['output'];
  vault: Vault;
};

export type DailyInterestRate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DailyInterestRate_Filter>>>;
  averageRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  averageRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DailyInterestRate_Filter>>>;
  sumRates?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sumRates_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updateCount?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updateCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum DailyInterestRate_OrderBy {
  AverageRate = 'averageRate',
  Date = 'date',
  Id = 'id',
  SumRates = 'sumRates',
  UpdateCount = 'updateCount',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type Deposit = Event & {
  __typename?: 'Deposit';
  /**  Amount of token deposited in native units  */
  amount: Scalars['BigInt']['output'];
  /**  Amount of token deposited in USD  */
  amountUSD: Scalars['BigDecimal']['output'];
  /**  Token deposited  */
  asset: Token;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Address that deposited tokens  */
  from: Scalars['String']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the position  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Amount of input token in the position in USD  */
  inputTokenBalanceNormalizedUSD: Scalars['BigDecimal']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Position that this deposit belongs to  */
  position: Position;
  /**  The protocol this transaction belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Address that received tokens  */
  to: Scalars['String']['output'];
  /**  The vault involving this transaction  */
  vault: Vault;
};

export type Deposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Token_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalizedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalizedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Deposit_OrderBy {
  Amount = 'amount',
  AmountUsd = 'amountUSD',
  Asset = 'asset',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLastPriceBlockNumber = 'asset__lastPriceBlockNumber',
  AssetLastPriceUsd = 'asset__lastPriceUSD',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  BlockNumber = 'blockNumber',
  From = 'from',
  Hash = 'hash',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalizedUsd = 'inputTokenBalanceNormalizedUSD',
  LogIndex = 'logIndex',
  Position = 'position',
  PositionClaimableSummerToken = 'position__claimableSummerToken',
  PositionClaimableSummerTokenNormalized = 'position__claimableSummerTokenNormalized',
  PositionClaimedSummerToken = 'position__claimedSummerToken',
  PositionClaimedSummerTokenNormalized = 'position__claimedSummerTokenNormalized',
  PositionCreatedBlockNumber = 'position__createdBlockNumber',
  PositionCreatedTimestamp = 'position__createdTimestamp',
  PositionId = 'position__id',
  PositionInputTokenBalance = 'position__inputTokenBalance',
  PositionInputTokenBalanceNormalized = 'position__inputTokenBalanceNormalized',
  PositionInputTokenBalanceNormalizedInUsd = 'position__inputTokenBalanceNormalizedInUSD',
  PositionInputTokenDeposits = 'position__inputTokenDeposits',
  PositionInputTokenDepositsNormalized = 'position__inputTokenDepositsNormalized',
  PositionInputTokenDepositsNormalizedInUsd = 'position__inputTokenDepositsNormalizedInUSD',
  PositionInputTokenWithdrawals = 'position__inputTokenWithdrawals',
  PositionInputTokenWithdrawalsNormalized = 'position__inputTokenWithdrawalsNormalized',
  PositionInputTokenWithdrawalsNormalizedInUsd = 'position__inputTokenWithdrawalsNormalizedInUSD',
  PositionOutputTokenBalance = 'position__outputTokenBalance',
  PositionStakedInputTokenBalance = 'position__stakedInputTokenBalance',
  PositionStakedInputTokenBalanceNormalized = 'position__stakedInputTokenBalanceNormalized',
  PositionStakedInputTokenBalanceNormalizedInUsd = 'position__stakedInputTokenBalanceNormalizedInUSD',
  PositionStakedOutputTokenBalance = 'position__stakedOutputTokenBalance',
  PositionUnstakedInputTokenBalance = 'position__unstakedInputTokenBalance',
  PositionUnstakedInputTokenBalanceNormalized = 'position__unstakedInputTokenBalanceNormalized',
  PositionUnstakedInputTokenBalanceNormalizedInUsd = 'position__unstakedInputTokenBalanceNormalizedInUSD',
  PositionUnstakedOutputTokenBalance = 'position__unstakedOutputTokenBalance',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  To = 'to',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type Disembark = Event & {
  __typename?: 'Disembark';
  /**  Amount of token withdrawn in native units  */
  amount: Scalars['BigInt']['output'];
  /**  Amount of token withdrawn in USD  */
  amountUSD: Scalars['BigDecimal']['output'];
  ark: Ark;
  /**  Token withdrawn  */
  asset: Token;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Market that tokens are withdrawn from  */
  from: Scalars['String']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  The protocol this transaction belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Address that received tokens  */
  to: Scalars['String']['output'];
  /**  The vault involving this transaction  */
  vault: Vault;
};

export type Disembark_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Disembark_Filter>>>;
  ark?: InputMaybe<Scalars['String']['input']>;
  ark_?: InputMaybe<Ark_Filter>;
  ark_contains?: InputMaybe<Scalars['String']['input']>;
  ark_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_gt?: InputMaybe<Scalars['String']['input']>;
  ark_gte?: InputMaybe<Scalars['String']['input']>;
  ark_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_lt?: InputMaybe<Scalars['String']['input']>;
  ark_lte?: InputMaybe<Scalars['String']['input']>;
  ark_not?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Token_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Disembark_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Disembark_OrderBy {
  Amount = 'amount',
  AmountUsd = 'amountUSD',
  Ark = 'ark',
  ArkCumulativeDeposits = 'ark___cumulativeDeposits',
  ArkCumulativeWithdrawals = 'ark___cumulativeWithdrawals',
  ArkLastUpdateInputTokenBalance = 'ark___lastUpdateInputTokenBalance',
  ArkCalculatedApr = 'ark__calculatedApr',
  ArkCreatedBlockNumber = 'ark__createdBlockNumber',
  ArkCreatedTimestamp = 'ark__createdTimestamp',
  ArkCumulativeEarnings = 'ark__cumulativeEarnings',
  ArkCumulativeProtocolSideRevenueUsd = 'ark__cumulativeProtocolSideRevenueUSD',
  ArkCumulativeSupplySideRevenueUsd = 'ark__cumulativeSupplySideRevenueUSD',
  ArkCumulativeTotalRevenueUsd = 'ark__cumulativeTotalRevenueUSD',
  ArkDepositCap = 'ark__depositCap',
  ArkDepositLimit = 'ark__depositLimit',
  ArkDetails = 'ark__details',
  ArkId = 'ark__id',
  ArkInputTokenBalance = 'ark__inputTokenBalance',
  ArkLastUpdateTimestamp = 'ark__lastUpdateTimestamp',
  ArkMaxDepositPercentageOfTvl = 'ark__maxDepositPercentageOfTVL',
  ArkMaxRebalanceInflow = 'ark__maxRebalanceInflow',
  ArkMaxRebalanceOutflow = 'ark__maxRebalanceOutflow',
  ArkName = 'ark__name',
  ArkProductId = 'ark__productId',
  ArkRequiresKeeperData = 'ark__requiresKeeperData',
  ArkTotalValueLockedUsd = 'ark__totalValueLockedUSD',
  Asset = 'asset',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLastPriceBlockNumber = 'asset__lastPriceBlockNumber',
  AssetLastPriceUsd = 'asset__lastPriceUSD',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  BlockNumber = 'blockNumber',
  From = 'from',
  Hash = 'hash',
  Id = 'id',
  LogIndex = 'logIndex',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  To = 'to',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

/**
 * An event is any user action that occurs in a protocol. Generally, they are Ethereum events
 * emitted by a function in the smart contracts, stored in transaction receipts as event logs.
 * However, some user actions of interest are function calls that don't emit events. For example,
 * the deposit and withdraw functions in Yearn do not emit any events. In our subgraphs, we still
 * store them as events, although they are not technically Ethereum events emitted by smart
 * contracts.
 *
 */
export type Event = {
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Address that sent tokens  */
  from: Scalars['String']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  The protocol this transaction belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Address that received tokens  */
  to: Scalars['String']['output'];
};

export type Event_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Event_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Event_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Event_OrderBy {
  BlockNumber = 'blockNumber',
  From = 'from',
  Hash = 'hash',
  Id = 'id',
  LogIndex = 'logIndex',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  To = 'to'
}

export type FinancialsDailySnapshot = {
  __typename?: 'FinancialsDailySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Gross revenue for the protocol (revenue claimed by protocol). Examples: AMM protocol fee (Sushi’s 0.05%). OpenSea 10% sell fee.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Revenue claimed by suppliers to the protocol. LPs on DEXs (e.g. 0.25% of the swap fee in Sushiswap). Depositors on Lending Protocols. NFT sellers on OpenSea.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol. e.g. 0.30% of swap fee in Sushiswap, all yield generated by Yearn.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Gross revenue for the protocol (revenue claimed by protocol). Examples: AMM protocol fee (Sushi’s 0.05%). OpenSea 10% sell fee.  */
  dailyProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Revenue claimed by suppliers to the protocol. LPs on DEXs (e.g. 0.25% of the swap fee in Sushiswap). Depositors on Lending Protocols. NFT sellers on OpenSea.  */
  dailySupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol. e.g. 0.30% of swap fee in Sushiswap, all yield generated by Yearn.  */
  dailyTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  ID is # of days since Unix epoch time  */
  id: Scalars['ID']['output'];
  /**  Protocol this snapshot is associated with  */
  protocol: YieldAggregator;
  /**  Current PCV (Protocol Controlled Value). Only relevant for protocols with PCV.  */
  protocolControlledValueUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Current TVL (Total Value Locked) of the entire protocol  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
};

export type FinancialsDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FinancialsDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FinancialsDailySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocolControlledValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolControlledValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum FinancialsDailySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CumulativeProtocolSideRevenueUsd = 'cumulativeProtocolSideRevenueUSD',
  CumulativeSupplySideRevenueUsd = 'cumulativeSupplySideRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  DailyProtocolSideRevenueUsd = 'dailyProtocolSideRevenueUSD',
  DailySupplySideRevenueUsd = 'dailySupplySideRevenueUSD',
  DailyTotalRevenueUsd = 'dailyTotalRevenueUSD',
  Id = 'id',
  Protocol = 'protocol',
  ProtocolControlledValueUsd = 'protocolControlledValueUSD',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  TotalValueLockedUsd = 'totalValueLockedUSD'
}

export type GovernanceRewardsManager = {
  __typename?: 'GovernanceRewardsManager';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type GovernanceRewardsManager_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<GovernanceRewardsManager_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GovernanceRewardsManager_Filter>>>;
};

export enum GovernanceRewardsManager_OrderBy {
  Address = 'address',
  Id = 'id'
}

export type GovernanceStaking = {
  __typename?: 'GovernanceStaking';
  accounts: Array<Account>;
  id: Scalars['ID']['output'];
  /**  Per-block reward token emission as of the current block normalized to a day, in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmount: Array<Scalars['BigInt']['output']>;
  /**  Per-block reward token emission as of the current block normalized to a day, in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmountsPerOutputToken: Array<Scalars['BigInt']['output']>;
  /**  Duration of the reward token emission in seconds  */
  rewardTokenEmissionsFinish: Array<Scalars['BigInt']['output']>;
  /**  Per-block reward token emission as of the current block normalized to a day, in USD value. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsUSD?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  rewardTokens: Array<Token>;
  summerStaked: Scalars['BigInt']['output'];
  summerStakedNormalized: Scalars['BigDecimal']['output'];
};


export type GovernanceStakingAccountsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Account_Filter>;
};


export type GovernanceStakingRewardTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Token_Filter>;
};

export type GovernanceStaking_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accounts?: InputMaybe<Array<Scalars['String']['input']>>;
  accounts_?: InputMaybe<Account_Filter>;
  accounts_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  accounts_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  accounts_not?: InputMaybe<Array<Scalars['String']['input']>>;
  accounts_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  accounts_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  and?: InputMaybe<Array<InputMaybe<GovernanceStaking_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GovernanceStaking_Filter>>>;
  rewardTokenEmissionsAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokens?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_?: InputMaybe<Token_Filter>;
  rewardTokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  summerStaked?: InputMaybe<Scalars['BigInt']['input']>;
  summerStakedNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  summerStakedNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  summerStakedNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  summerStakedNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  summerStakedNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  summerStakedNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  summerStakedNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  summerStakedNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  summerStaked_gt?: InputMaybe<Scalars['BigInt']['input']>;
  summerStaked_gte?: InputMaybe<Scalars['BigInt']['input']>;
  summerStaked_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  summerStaked_lt?: InputMaybe<Scalars['BigInt']['input']>;
  summerStaked_lte?: InputMaybe<Scalars['BigInt']['input']>;
  summerStaked_not?: InputMaybe<Scalars['BigInt']['input']>;
  summerStaked_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum GovernanceStaking_OrderBy {
  Accounts = 'accounts',
  Id = 'id',
  RewardTokenEmissionsAmount = 'rewardTokenEmissionsAmount',
  RewardTokenEmissionsAmountsPerOutputToken = 'rewardTokenEmissionsAmountsPerOutputToken',
  RewardTokenEmissionsFinish = 'rewardTokenEmissionsFinish',
  RewardTokenEmissionsUsd = 'rewardTokenEmissionsUSD',
  RewardTokens = 'rewardTokens',
  SummerStaked = 'summerStaked',
  SummerStakedNormalized = 'summerStakedNormalized'
}

export type HourlyInterestRate = {
  __typename?: 'HourlyInterestRate';
  averageRate: Scalars['BigDecimal']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  sumRates: Scalars['BigDecimal']['output'];
  updateCount: Scalars['BigInt']['output'];
  vault: Vault;
};

export type HourlyInterestRate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<HourlyInterestRate_Filter>>>;
  averageRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  averageRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<HourlyInterestRate_Filter>>>;
  sumRates?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sumRates_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updateCount?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updateCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum HourlyInterestRate_OrderBy {
  AverageRate = 'averageRate',
  Date = 'date',
  Id = 'id',
  SumRates = 'sumRates',
  UpdateCount = 'updateCount',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export enum Network {
  ArbitrumOne = 'ARBITRUM_ONE',
  ArweaveMainnet = 'ARWEAVE_MAINNET',
  Aurora = 'AURORA',
  Avalanche = 'AVALANCHE',
  Base = 'BASE',
  Boba = 'BOBA',
  Bsc = 'BSC',
  Celo = 'CELO',
  Cosmos = 'COSMOS',
  Cronos = 'CRONOS',
  Fantom = 'FANTOM',
  Fuse = 'FUSE',
  Gnosis = 'GNOSIS',
  Harmony = 'HARMONY',
  Juno = 'JUNO',
  Mainnet = 'MAINNET',
  Matic = 'MATIC',
  Moonbeam = 'MOONBEAM',
  Moonriver = 'MOONRIVER',
  NearMainnet = 'NEAR_MAINNET',
  Optimism = 'OPTIMISM',
  Osmosis = 'OSMOSIS',
  SonicMainnet = 'SONIC_MAINNET'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Position = {
  __typename?: 'Position';
  /**  Account associated with the position  */
  account: Account;
  claimableSummerToken: Scalars['BigInt']['output'];
  claimableSummerTokenNormalized: Scalars['BigDecimal']['output'];
  claimedSummerToken: Scalars['BigInt']['output'];
  claimedSummerTokenNormalized: Scalars['BigDecimal']['output'];
  /**  Creation block number  */
  createdBlockNumber: Scalars['BigInt']['output'];
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt']['output'];
  dailySnapshots: Array<PositionDailySnapshot>;
  deposits: Array<Deposit>;
  hourlySnapshots: Array<PositionHourlySnapshot>;
  /**  Unique identifier for the position  */
  id: Scalars['ID']['output'];
  /**  Balance of the input token for the position  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Normalized supply of the input token  */
  inputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Normalized supply of the input token in USD  */
  inputTokenBalanceNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Sum of deposits in the position - in input token precision */
  inputTokenDeposits: Scalars['BigInt']['output'];
  /**  Sum of deposits in the position - in input token precision normalized */
  inputTokenDepositsNormalized: Scalars['BigDecimal']['output'];
  /**  Sum of deposits in the position - in input token precision normalized to USD */
  inputTokenDepositsNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Sum of withdrawals in the position - in input token precision */
  inputTokenWithdrawals: Scalars['BigInt']['output'];
  /**  Sum of withdrawals in the position - in input token precision normalized */
  inputTokenWithdrawalsNormalized: Scalars['BigDecimal']['output'];
  /**  Sum of withdrawals in the position - in input token precision normalized to USD */
  inputTokenWithdrawalsNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Supply of the output token for the position  */
  outputTokenBalance: Scalars['BigInt']['output'];
  rewards: Array<PositionRewards>;
  stakedEvents: Array<Staked>;
  /**  Staked balance of the input token for the position  */
  stakedInputTokenBalance: Scalars['BigInt']['output'];
  /**  Normalized staked balance of the input token  */
  stakedInputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Normalized staked balance of the input token in USD  */
  stakedInputTokenBalanceNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Staked balance of the output token for the position  */
  stakedOutputTokenBalance: Scalars['BigInt']['output'];
  unstakedEvents: Array<Unstaked>;
  /**  Unstaked balance of the input token for the position  */
  unstakedInputTokenBalance: Scalars['BigInt']['output'];
  /**  Normalized unstaked balance of the input token  */
  unstakedInputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Normalized unstaked balance of the input token in USD  */
  unstakedInputTokenBalanceNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Unstaked balance of the output token for the position  */
  unstakedOutputTokenBalance: Scalars['BigInt']['output'];
  /**  Vault where the position is held  */
  vault: Vault;
  weeklySnapshots: Array<PositionWeeklySnapshot>;
  withdrawals: Array<Withdraw>;
};


export type PositionDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PositionDailySnapshot_Filter>;
};


export type PositionDepositsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Deposit_Filter>;
};


export type PositionHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PositionHourlySnapshot_Filter>;
};


export type PositionRewardsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionRewards_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PositionRewards_Filter>;
};


export type PositionStakedEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Staked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Staked_Filter>;
};


export type PositionUnstakedEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Unstaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Unstaked_Filter>;
};


export type PositionWeeklySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionWeeklySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PositionWeeklySnapshot_Filter>;
};


export type PositionWithdrawalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdraw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Withdraw_Filter>;
};

export type PositionDailySnapshot = {
  __typename?: 'PositionDailySnapshot';
  /**  { Position ID }-{ # of days since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the position  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Input token balance in the position normalized */
  inputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Amount of input token in the position normalized to USD  */
  inputTokenBalanceNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Sum of deposits in the position - in input token precision */
  inputTokenDeposits: Scalars['BigInt']['output'];
  /**  Sum of deposits in the position - in input token precision normalized */
  inputTokenDepositsNormalized: Scalars['BigDecimal']['output'];
  /**  Sum of deposits in the position - in input token precision normalized to USD */
  inputTokenDepositsNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Sum of withdrawals in the position - in input token precision */
  inputTokenWithdrawals: Scalars['BigInt']['output'];
  /**  Sum of withdrawals in the position - in input token precision normalized */
  inputTokenWithdrawalsNormalized: Scalars['BigDecimal']['output'];
  /**  Sum of withdrawals in the position - in input token precision normalized to USD */
  inputTokenWithdrawalsNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Amount of output token in the position  */
  outputTokenBalance: Scalars['BigInt']['output'];
  /**  The position this snapshot belongs to  */
  position: Position;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};

export type PositionDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PositionDailySnapshot_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenDeposits?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDepositsNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDeposits_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenDeposits_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenWithdrawals?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawalsNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenWithdrawals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PositionDailySnapshot_Filter>>>;
  outputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PositionDailySnapshot_OrderBy {
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalized = 'inputTokenBalanceNormalized',
  InputTokenBalanceNormalizedInUsd = 'inputTokenBalanceNormalizedInUSD',
  InputTokenDeposits = 'inputTokenDeposits',
  InputTokenDepositsNormalized = 'inputTokenDepositsNormalized',
  InputTokenDepositsNormalizedInUsd = 'inputTokenDepositsNormalizedInUSD',
  InputTokenWithdrawals = 'inputTokenWithdrawals',
  InputTokenWithdrawalsNormalized = 'inputTokenWithdrawalsNormalized',
  InputTokenWithdrawalsNormalizedInUsd = 'inputTokenWithdrawalsNormalizedInUSD',
  OutputTokenBalance = 'outputTokenBalance',
  Position = 'position',
  PositionClaimableSummerToken = 'position__claimableSummerToken',
  PositionClaimableSummerTokenNormalized = 'position__claimableSummerTokenNormalized',
  PositionClaimedSummerToken = 'position__claimedSummerToken',
  PositionClaimedSummerTokenNormalized = 'position__claimedSummerTokenNormalized',
  PositionCreatedBlockNumber = 'position__createdBlockNumber',
  PositionCreatedTimestamp = 'position__createdTimestamp',
  PositionId = 'position__id',
  PositionInputTokenBalance = 'position__inputTokenBalance',
  PositionInputTokenBalanceNormalized = 'position__inputTokenBalanceNormalized',
  PositionInputTokenBalanceNormalizedInUsd = 'position__inputTokenBalanceNormalizedInUSD',
  PositionInputTokenDeposits = 'position__inputTokenDeposits',
  PositionInputTokenDepositsNormalized = 'position__inputTokenDepositsNormalized',
  PositionInputTokenDepositsNormalizedInUsd = 'position__inputTokenDepositsNormalizedInUSD',
  PositionInputTokenWithdrawals = 'position__inputTokenWithdrawals',
  PositionInputTokenWithdrawalsNormalized = 'position__inputTokenWithdrawalsNormalized',
  PositionInputTokenWithdrawalsNormalizedInUsd = 'position__inputTokenWithdrawalsNormalizedInUSD',
  PositionOutputTokenBalance = 'position__outputTokenBalance',
  PositionStakedInputTokenBalance = 'position__stakedInputTokenBalance',
  PositionStakedInputTokenBalanceNormalized = 'position__stakedInputTokenBalanceNormalized',
  PositionStakedInputTokenBalanceNormalizedInUsd = 'position__stakedInputTokenBalanceNormalizedInUSD',
  PositionStakedOutputTokenBalance = 'position__stakedOutputTokenBalance',
  PositionUnstakedInputTokenBalance = 'position__unstakedInputTokenBalance',
  PositionUnstakedInputTokenBalanceNormalized = 'position__unstakedInputTokenBalanceNormalized',
  PositionUnstakedInputTokenBalanceNormalizedInUsd = 'position__unstakedInputTokenBalanceNormalizedInUSD',
  PositionUnstakedOutputTokenBalance = 'position__unstakedOutputTokenBalance',
  Timestamp = 'timestamp'
}

export type PositionHourlySnapshot = {
  __typename?: 'PositionHourlySnapshot';
  /**  { Position ID }-{ # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the position  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Input token balance in the position normalized */
  inputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Amount of input token in the position normalized to USD  */
  inputTokenBalanceNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Sum of deposits in the position - in input token precision */
  inputTokenDeposits: Scalars['BigInt']['output'];
  /**  Sum of deposits in the position - in input token precision normalized */
  inputTokenDepositsNormalized: Scalars['BigDecimal']['output'];
  /**  Sum of deposits in the position - in input token precision normalized to USD */
  inputTokenDepositsNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Sum of withdrawals in the position - in input token precision */
  inputTokenWithdrawals: Scalars['BigInt']['output'];
  /**  Sum of withdrawals in the position - in input token precision normalized */
  inputTokenWithdrawalsNormalized: Scalars['BigDecimal']['output'];
  /**  Sum of withdrawals in the position - in input token precision normalized to USD */
  inputTokenWithdrawalsNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Amount of output token in the position  */
  outputTokenBalance: Scalars['BigInt']['output'];
  /**  The position this snapshot belongs to  */
  position: Position;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};

export type PositionHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PositionHourlySnapshot_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenDeposits?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDepositsNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDeposits_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenDeposits_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenWithdrawals?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawalsNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenWithdrawals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PositionHourlySnapshot_Filter>>>;
  outputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PositionHourlySnapshot_OrderBy {
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalized = 'inputTokenBalanceNormalized',
  InputTokenBalanceNormalizedInUsd = 'inputTokenBalanceNormalizedInUSD',
  InputTokenDeposits = 'inputTokenDeposits',
  InputTokenDepositsNormalized = 'inputTokenDepositsNormalized',
  InputTokenDepositsNormalizedInUsd = 'inputTokenDepositsNormalizedInUSD',
  InputTokenWithdrawals = 'inputTokenWithdrawals',
  InputTokenWithdrawalsNormalized = 'inputTokenWithdrawalsNormalized',
  InputTokenWithdrawalsNormalizedInUsd = 'inputTokenWithdrawalsNormalizedInUSD',
  OutputTokenBalance = 'outputTokenBalance',
  Position = 'position',
  PositionClaimableSummerToken = 'position__claimableSummerToken',
  PositionClaimableSummerTokenNormalized = 'position__claimableSummerTokenNormalized',
  PositionClaimedSummerToken = 'position__claimedSummerToken',
  PositionClaimedSummerTokenNormalized = 'position__claimedSummerTokenNormalized',
  PositionCreatedBlockNumber = 'position__createdBlockNumber',
  PositionCreatedTimestamp = 'position__createdTimestamp',
  PositionId = 'position__id',
  PositionInputTokenBalance = 'position__inputTokenBalance',
  PositionInputTokenBalanceNormalized = 'position__inputTokenBalanceNormalized',
  PositionInputTokenBalanceNormalizedInUsd = 'position__inputTokenBalanceNormalizedInUSD',
  PositionInputTokenDeposits = 'position__inputTokenDeposits',
  PositionInputTokenDepositsNormalized = 'position__inputTokenDepositsNormalized',
  PositionInputTokenDepositsNormalizedInUsd = 'position__inputTokenDepositsNormalizedInUSD',
  PositionInputTokenWithdrawals = 'position__inputTokenWithdrawals',
  PositionInputTokenWithdrawalsNormalized = 'position__inputTokenWithdrawalsNormalized',
  PositionInputTokenWithdrawalsNormalizedInUsd = 'position__inputTokenWithdrawalsNormalizedInUSD',
  PositionOutputTokenBalance = 'position__outputTokenBalance',
  PositionStakedInputTokenBalance = 'position__stakedInputTokenBalance',
  PositionStakedInputTokenBalanceNormalized = 'position__stakedInputTokenBalanceNormalized',
  PositionStakedInputTokenBalanceNormalizedInUsd = 'position__stakedInputTokenBalanceNormalizedInUSD',
  PositionStakedOutputTokenBalance = 'position__stakedOutputTokenBalance',
  PositionUnstakedInputTokenBalance = 'position__unstakedInputTokenBalance',
  PositionUnstakedInputTokenBalanceNormalized = 'position__unstakedInputTokenBalanceNormalized',
  PositionUnstakedInputTokenBalanceNormalizedInUsd = 'position__unstakedInputTokenBalanceNormalizedInUSD',
  PositionUnstakedOutputTokenBalance = 'position__unstakedOutputTokenBalance',
  Timestamp = 'timestamp'
}

export type PositionRewards = {
  __typename?: 'PositionRewards';
  claimable: Scalars['BigInt']['output'];
  claimableNormalized: Scalars['BigDecimal']['output'];
  claimed: Scalars['BigInt']['output'];
  claimedNormalized: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  position: Position;
  rewardToken: Token;
};

export type PositionRewards_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PositionRewards_Filter>>>;
  claimable?: InputMaybe<Scalars['BigInt']['input']>;
  claimableNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimableNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimable_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimable_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimable_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimed?: InputMaybe<Scalars['BigInt']['input']>;
  claimedNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimedNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PositionRewards_Filter>>>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken?: InputMaybe<Scalars['String']['input']>;
  rewardToken_?: InputMaybe<Token_Filter>;
  rewardToken_contains?: InputMaybe<Scalars['String']['input']>;
  rewardToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_gt?: InputMaybe<Scalars['String']['input']>;
  rewardToken_gte?: InputMaybe<Scalars['String']['input']>;
  rewardToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardToken_lt?: InputMaybe<Scalars['String']['input']>;
  rewardToken_lte?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  rewardToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum PositionRewards_OrderBy {
  Claimable = 'claimable',
  ClaimableNormalized = 'claimableNormalized',
  Claimed = 'claimed',
  ClaimedNormalized = 'claimedNormalized',
  Id = 'id',
  Position = 'position',
  PositionClaimableSummerToken = 'position__claimableSummerToken',
  PositionClaimableSummerTokenNormalized = 'position__claimableSummerTokenNormalized',
  PositionClaimedSummerToken = 'position__claimedSummerToken',
  PositionClaimedSummerTokenNormalized = 'position__claimedSummerTokenNormalized',
  PositionCreatedBlockNumber = 'position__createdBlockNumber',
  PositionCreatedTimestamp = 'position__createdTimestamp',
  PositionId = 'position__id',
  PositionInputTokenBalance = 'position__inputTokenBalance',
  PositionInputTokenBalanceNormalized = 'position__inputTokenBalanceNormalized',
  PositionInputTokenBalanceNormalizedInUsd = 'position__inputTokenBalanceNormalizedInUSD',
  PositionInputTokenDeposits = 'position__inputTokenDeposits',
  PositionInputTokenDepositsNormalized = 'position__inputTokenDepositsNormalized',
  PositionInputTokenDepositsNormalizedInUsd = 'position__inputTokenDepositsNormalizedInUSD',
  PositionInputTokenWithdrawals = 'position__inputTokenWithdrawals',
  PositionInputTokenWithdrawalsNormalized = 'position__inputTokenWithdrawalsNormalized',
  PositionInputTokenWithdrawalsNormalizedInUsd = 'position__inputTokenWithdrawalsNormalizedInUSD',
  PositionOutputTokenBalance = 'position__outputTokenBalance',
  PositionStakedInputTokenBalance = 'position__stakedInputTokenBalance',
  PositionStakedInputTokenBalanceNormalized = 'position__stakedInputTokenBalanceNormalized',
  PositionStakedInputTokenBalanceNormalizedInUsd = 'position__stakedInputTokenBalanceNormalizedInUSD',
  PositionStakedOutputTokenBalance = 'position__stakedOutputTokenBalance',
  PositionUnstakedInputTokenBalance = 'position__unstakedInputTokenBalance',
  PositionUnstakedInputTokenBalanceNormalized = 'position__unstakedInputTokenBalanceNormalized',
  PositionUnstakedInputTokenBalanceNormalizedInUsd = 'position__unstakedInputTokenBalanceNormalizedInUSD',
  PositionUnstakedOutputTokenBalance = 'position__unstakedOutputTokenBalance',
  RewardToken = 'rewardToken',
  RewardTokenDecimals = 'rewardToken__decimals',
  RewardTokenId = 'rewardToken__id',
  RewardTokenLastPriceBlockNumber = 'rewardToken__lastPriceBlockNumber',
  RewardTokenLastPriceUsd = 'rewardToken__lastPriceUSD',
  RewardTokenName = 'rewardToken__name',
  RewardTokenSymbol = 'rewardToken__symbol'
}

export type PositionWeeklySnapshot = {
  __typename?: 'PositionWeeklySnapshot';
  /**  { Position ID }-{ # of weeks since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the position  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Input token balance in the position normalized */
  inputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Amount of input token in the position normalized to USD  */
  inputTokenBalanceNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Sum of deposits in the position - in input token precision */
  inputTokenDeposits: Scalars['BigInt']['output'];
  /**  Sum of deposits in the position - in input token precision normalized */
  inputTokenDepositsNormalized: Scalars['BigDecimal']['output'];
  /**  Sum of deposits in the position - in input token precision normalized to USD */
  inputTokenDepositsNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Sum of withdrawals in the position - in input token precision */
  inputTokenWithdrawals: Scalars['BigInt']['output'];
  /**  Sum of withdrawals in the position - in input token precision normalized */
  inputTokenWithdrawalsNormalized: Scalars['BigDecimal']['output'];
  /**  Sum of withdrawals in the position - in input token precision normalized to USD */
  inputTokenWithdrawalsNormalizedInUSD: Scalars['BigDecimal']['output'];
  /**  Amount of output token in the position  */
  outputTokenBalance: Scalars['BigInt']['output'];
  /**  The position this snapshot belongs to  */
  position: Position;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};

export type PositionWeeklySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PositionWeeklySnapshot_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenDeposits?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDepositsNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDeposits_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenDeposits_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenWithdrawals?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawalsNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenWithdrawals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PositionWeeklySnapshot_Filter>>>;
  outputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PositionWeeklySnapshot_OrderBy {
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalized = 'inputTokenBalanceNormalized',
  InputTokenBalanceNormalizedInUsd = 'inputTokenBalanceNormalizedInUSD',
  InputTokenDeposits = 'inputTokenDeposits',
  InputTokenDepositsNormalized = 'inputTokenDepositsNormalized',
  InputTokenDepositsNormalizedInUsd = 'inputTokenDepositsNormalizedInUSD',
  InputTokenWithdrawals = 'inputTokenWithdrawals',
  InputTokenWithdrawalsNormalized = 'inputTokenWithdrawalsNormalized',
  InputTokenWithdrawalsNormalizedInUsd = 'inputTokenWithdrawalsNormalizedInUSD',
  OutputTokenBalance = 'outputTokenBalance',
  Position = 'position',
  PositionClaimableSummerToken = 'position__claimableSummerToken',
  PositionClaimableSummerTokenNormalized = 'position__claimableSummerTokenNormalized',
  PositionClaimedSummerToken = 'position__claimedSummerToken',
  PositionClaimedSummerTokenNormalized = 'position__claimedSummerTokenNormalized',
  PositionCreatedBlockNumber = 'position__createdBlockNumber',
  PositionCreatedTimestamp = 'position__createdTimestamp',
  PositionId = 'position__id',
  PositionInputTokenBalance = 'position__inputTokenBalance',
  PositionInputTokenBalanceNormalized = 'position__inputTokenBalanceNormalized',
  PositionInputTokenBalanceNormalizedInUsd = 'position__inputTokenBalanceNormalizedInUSD',
  PositionInputTokenDeposits = 'position__inputTokenDeposits',
  PositionInputTokenDepositsNormalized = 'position__inputTokenDepositsNormalized',
  PositionInputTokenDepositsNormalizedInUsd = 'position__inputTokenDepositsNormalizedInUSD',
  PositionInputTokenWithdrawals = 'position__inputTokenWithdrawals',
  PositionInputTokenWithdrawalsNormalized = 'position__inputTokenWithdrawalsNormalized',
  PositionInputTokenWithdrawalsNormalizedInUsd = 'position__inputTokenWithdrawalsNormalizedInUSD',
  PositionOutputTokenBalance = 'position__outputTokenBalance',
  PositionStakedInputTokenBalance = 'position__stakedInputTokenBalance',
  PositionStakedInputTokenBalanceNormalized = 'position__stakedInputTokenBalanceNormalized',
  PositionStakedInputTokenBalanceNormalizedInUsd = 'position__stakedInputTokenBalanceNormalizedInUSD',
  PositionStakedOutputTokenBalance = 'position__stakedOutputTokenBalance',
  PositionUnstakedInputTokenBalance = 'position__unstakedInputTokenBalance',
  PositionUnstakedInputTokenBalanceNormalized = 'position__unstakedInputTokenBalanceNormalized',
  PositionUnstakedInputTokenBalanceNormalizedInUsd = 'position__unstakedInputTokenBalanceNormalizedInUSD',
  PositionUnstakedOutputTokenBalance = 'position__unstakedOutputTokenBalance',
  Timestamp = 'timestamp'
}

export type Position_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<Account_Filter>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Position_Filter>>>;
  claimableSummerToken?: InputMaybe<Scalars['BigInt']['input']>;
  claimableSummerTokenNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableSummerTokenNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableSummerTokenNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableSummerTokenNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimableSummerTokenNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableSummerTokenNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableSummerTokenNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimableSummerTokenNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimableSummerToken_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimableSummerToken_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimableSummerToken_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimableSummerToken_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimableSummerToken_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimableSummerToken_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimableSummerToken_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimedSummerToken?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerTokenNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimedSummerTokenNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  claimedSummerTokenNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  claimedSummerToken_gt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_gte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  claimedSummerToken_lt?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_lte?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_not?: InputMaybe<Scalars['BigInt']['input']>;
  claimedSummerToken_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailySnapshots_?: InputMaybe<PositionDailySnapshot_Filter>;
  deposits_?: InputMaybe<Deposit_Filter>;
  hourlySnapshots_?: InputMaybe<PositionHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenDeposits?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDepositsNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDepositsNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenDepositsNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenDeposits_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenDeposits_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenDeposits_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenWithdrawals?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawalsNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawalsNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenWithdrawalsNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenWithdrawals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenWithdrawals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenWithdrawals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Position_Filter>>>;
  outputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewards_?: InputMaybe<PositionRewards_Filter>;
  stakedEvents_?: InputMaybe<Staked_Filter>;
  stakedInputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  stakedInputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedInputTokenBalanceNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedInputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedInputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedInputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedInputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedInputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedInputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedInputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedInputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedInputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedInputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedOutputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedOutputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakedEvents_?: InputMaybe<Unstaked_Filter>;
  unstakedInputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedInputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  unstakedInputTokenBalanceNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  unstakedInputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  unstakedInputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  unstakedInputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  unstakedInputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedInputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedInputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakedInputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedInputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedInputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedInputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakedOutputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedOutputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedOutputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedOutputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unstakedOutputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedOutputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedOutputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  unstakedOutputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weeklySnapshots_?: InputMaybe<PositionWeeklySnapshot_Filter>;
  withdrawals_?: InputMaybe<Withdraw_Filter>;
};

export enum Position_OrderBy {
  Account = 'account',
  AccountClaimedSummerToken = 'account__claimedSummerToken',
  AccountClaimedSummerTokenNormalized = 'account__claimedSummerTokenNormalized',
  AccountId = 'account__id',
  AccountLastUpdateBlock = 'account__lastUpdateBlock',
  AccountStakedSummerToken = 'account__stakedSummerToken',
  AccountStakedSummerTokenNormalized = 'account__stakedSummerTokenNormalized',
  ClaimableSummerToken = 'claimableSummerToken',
  ClaimableSummerTokenNormalized = 'claimableSummerTokenNormalized',
  ClaimedSummerToken = 'claimedSummerToken',
  ClaimedSummerTokenNormalized = 'claimedSummerTokenNormalized',
  CreatedBlockNumber = 'createdBlockNumber',
  CreatedTimestamp = 'createdTimestamp',
  DailySnapshots = 'dailySnapshots',
  Deposits = 'deposits',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalized = 'inputTokenBalanceNormalized',
  InputTokenBalanceNormalizedInUsd = 'inputTokenBalanceNormalizedInUSD',
  InputTokenDeposits = 'inputTokenDeposits',
  InputTokenDepositsNormalized = 'inputTokenDepositsNormalized',
  InputTokenDepositsNormalizedInUsd = 'inputTokenDepositsNormalizedInUSD',
  InputTokenWithdrawals = 'inputTokenWithdrawals',
  InputTokenWithdrawalsNormalized = 'inputTokenWithdrawalsNormalized',
  InputTokenWithdrawalsNormalizedInUsd = 'inputTokenWithdrawalsNormalizedInUSD',
  OutputTokenBalance = 'outputTokenBalance',
  Rewards = 'rewards',
  StakedEvents = 'stakedEvents',
  StakedInputTokenBalance = 'stakedInputTokenBalance',
  StakedInputTokenBalanceNormalized = 'stakedInputTokenBalanceNormalized',
  StakedInputTokenBalanceNormalizedInUsd = 'stakedInputTokenBalanceNormalizedInUSD',
  StakedOutputTokenBalance = 'stakedOutputTokenBalance',
  UnstakedEvents = 'unstakedEvents',
  UnstakedInputTokenBalance = 'unstakedInputTokenBalance',
  UnstakedInputTokenBalanceNormalized = 'unstakedInputTokenBalanceNormalized',
  UnstakedInputTokenBalanceNormalizedInUsd = 'unstakedInputTokenBalanceNormalizedInUSD',
  UnstakedOutputTokenBalance = 'unstakedOutputTokenBalance',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD',
  WeeklySnapshots = 'weeklySnapshots',
  Withdrawals = 'withdrawals'
}

export type PostActionArkSnapshot = {
  __typename?: 'PostActionArkSnapshot';
  /** Current APR */
  apr: Scalars['BigDecimal']['output'];
  /**  The ark this snapshot belongs to  */
  ark: Ark;
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Deposit limit of the ark  */
  depositLimit: Scalars['BigInt']['output'];
  /**  { Smart contract address of the vault }-{ # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the pool  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  The protocol this snapshot belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The vault this snapshot belongs to  */
  vault: Vault;
};

export type PostActionArkSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PostActionArkSnapshot_Filter>>>;
  apr?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  ark?: InputMaybe<Scalars['String']['input']>;
  ark_?: InputMaybe<Ark_Filter>;
  ark_contains?: InputMaybe<Scalars['String']['input']>;
  ark_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_gt?: InputMaybe<Scalars['String']['input']>;
  ark_gte?: InputMaybe<Scalars['String']['input']>;
  ark_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_lt?: InputMaybe<Scalars['String']['input']>;
  ark_lte?: InputMaybe<Scalars['String']['input']>;
  ark_not?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains?: InputMaybe<Scalars['String']['input']>;
  ark_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ark_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with?: InputMaybe<Scalars['String']['input']>;
  ark_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositLimit?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PostActionArkSnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum PostActionArkSnapshot_OrderBy {
  Apr = 'apr',
  Ark = 'ark',
  ArkCumulativeDeposits = 'ark___cumulativeDeposits',
  ArkCumulativeWithdrawals = 'ark___cumulativeWithdrawals',
  ArkLastUpdateInputTokenBalance = 'ark___lastUpdateInputTokenBalance',
  ArkCalculatedApr = 'ark__calculatedApr',
  ArkCreatedBlockNumber = 'ark__createdBlockNumber',
  ArkCreatedTimestamp = 'ark__createdTimestamp',
  ArkCumulativeEarnings = 'ark__cumulativeEarnings',
  ArkCumulativeProtocolSideRevenueUsd = 'ark__cumulativeProtocolSideRevenueUSD',
  ArkCumulativeSupplySideRevenueUsd = 'ark__cumulativeSupplySideRevenueUSD',
  ArkCumulativeTotalRevenueUsd = 'ark__cumulativeTotalRevenueUSD',
  ArkDepositCap = 'ark__depositCap',
  ArkDepositLimit = 'ark__depositLimit',
  ArkDetails = 'ark__details',
  ArkId = 'ark__id',
  ArkInputTokenBalance = 'ark__inputTokenBalance',
  ArkLastUpdateTimestamp = 'ark__lastUpdateTimestamp',
  ArkMaxDepositPercentageOfTvl = 'ark__maxDepositPercentageOfTVL',
  ArkMaxRebalanceInflow = 'ark__maxRebalanceInflow',
  ArkMaxRebalanceOutflow = 'ark__maxRebalanceOutflow',
  ArkName = 'ark__name',
  ArkProductId = 'ark__productId',
  ArkRequiresKeeperData = 'ark__requiresKeeperData',
  ArkTotalValueLockedUsd = 'ark__totalValueLockedUSD',
  BlockNumber = 'blockNumber',
  DepositLimit = 'depositLimit',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type PostActionVaultSnapshot = {
  __typename?: 'PostActionVaultSnapshot';
  /** Current APR */
  apr: Scalars['BigDecimal']['output'];
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  { Smart contract address of the vault }-{ # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the pool  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Amount of input token in the pool normalized  */
  inputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Price of input token in USD  */
  inputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Price per share of output token in USD  */
  outputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Total supply of output token  */
  outputTokenSupply: Scalars['BigInt']['output'];
  /**  Amount of input token per full share of output token. Usually corresponds to the value of `pricePerShare` or `pricePerFullShare` in the vault contract.  */
  pricePerShare?: Maybe<Scalars['BigDecimal']['output']>;
  /**  The protocol this snapshot belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The vault this snapshot belongs to  */
  vault: Vault;
};

export type PostActionVaultSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PostActionVaultSnapshot_Filter>>>;
  apr?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PostActionVaultSnapshot_Filter>>>;
  outputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerShare?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pricePerShare_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum PostActionVaultSnapshot_OrderBy {
  Apr = 'apr',
  BlockNumber = 'blockNumber',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalized = 'inputTokenBalanceNormalized',
  InputTokenPriceUsd = 'inputTokenPriceUSD',
  OutputTokenPriceUsd = 'outputTokenPriceUSD',
  OutputTokenSupply = 'outputTokenSupply',
  PricePerShare = 'pricePerShare',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type Protocol = {
  /**  Gross revenue for the protocol (revenue claimed by protocol). Examples: AMM protocol fee (Sushi’s 0.05%). OpenSea 10% sell fee.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Revenue claimed by suppliers to the protocol. LPs on DEXs (e.g. 0.25% of the swap fee in Sushiswap). Depositors on Lending Protocols. NFT sellers on OpenSea.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol. e.g. 0.30% of swap fee in Sushiswap, all yield generated by Yearn.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Daily usage metrics for this protocol  */
  dailyUsageMetrics: Array<UsageMetricsDailySnapshot>;
  /**  Daily financial metrics for this protocol  */
  financialMetrics: Array<FinancialsDailySnapshot>;
  /**  Hourly usage metrics for this protocol  */
  hourlyUsageMetrics: Array<UsageMetricsHourlySnapshot>;
  /**  Smart contract address of the protocol's main contract (Factory, Registry, etc)  */
  id: Scalars['ID']['output'];
  /**  Version of the methodology used to compute metrics, loosely based on SemVer format (e.g. 1.0.0)  */
  methodologyVersion: Scalars['String']['output'];
  /**  Name of the protocol, including version. e.g. Uniswap v3  */
  name: Scalars['String']['output'];
  /**  The blockchain network this subgraph is indexing on  */
  network: Network;
  /**  Current PCV (Protocol Controlled Value). Only relevant for protocols with PCV.  */
  protocolControlledValueUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Version of the subgraph schema, in SemVer format (e.g. 1.0.0)  */
  schemaVersion: Scalars['String']['output'];
  /**  Slug of protocol, including version. e.g. uniswap-v3  */
  slug: Scalars['String']['output'];
  /**  Version of the subgraph implementation, in SemVer format (e.g. 1.0.0)  */
  subgraphVersion: Scalars['String']['output'];
  /**  Total number of pools  */
  totalPoolCount: Scalars['Int']['output'];
  /**  Current TVL (Total Value Locked) of the entire protocol  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The type of protocol (e.g. DEX, Lending, Yield, etc)  */
  type: ProtocolType;
};


export type ProtocolDailyUsageMetricsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsageMetricsDailySnapshot_Filter>;
};


export type ProtocolFinancialMetricsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FinancialsDailySnapshot_Filter>;
};


export type ProtocolHourlyUsageMetricsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsageMetricsHourlySnapshot_Filter>;
};

export enum ProtocolType {
  Bridge = 'BRIDGE',
  Exchange = 'EXCHANGE',
  Generic = 'GENERIC',
  Lending = 'LENDING',
  Yield = 'YIELD'
}

export type Protocol_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Protocol_Filter>>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyUsageMetrics_?: InputMaybe<UsageMetricsDailySnapshot_Filter>;
  financialMetrics_?: InputMaybe<FinancialsDailySnapshot_Filter>;
  hourlyUsageMetrics_?: InputMaybe<UsageMetricsHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  methodologyVersion?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_lt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_lte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Network>;
  network_in?: InputMaybe<Array<Network>>;
  network_not?: InputMaybe<Network>;
  network_not_in?: InputMaybe<Array<Network>>;
  or?: InputMaybe<Array<InputMaybe<Protocol_Filter>>>;
  protocolControlledValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolControlledValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  schemaVersion?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_lt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_lte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_gt?: InputMaybe<Scalars['String']['input']>;
  slug_gte?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_lt?: InputMaybe<Scalars['String']['input']>;
  slug_lte?: InputMaybe<Scalars['String']['input']>;
  slug_not?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_lt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_lte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalPoolCount?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalPoolCount_lt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_lte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_not?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  type?: InputMaybe<ProtocolType>;
  type_in?: InputMaybe<Array<ProtocolType>>;
  type_not?: InputMaybe<ProtocolType>;
  type_not_in?: InputMaybe<Array<ProtocolType>>;
};

export enum Protocol_OrderBy {
  CumulativeProtocolSideRevenueUsd = 'cumulativeProtocolSideRevenueUSD',
  CumulativeSupplySideRevenueUsd = 'cumulativeSupplySideRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  DailyUsageMetrics = 'dailyUsageMetrics',
  FinancialMetrics = 'financialMetrics',
  HourlyUsageMetrics = 'hourlyUsageMetrics',
  Id = 'id',
  MethodologyVersion = 'methodologyVersion',
  Name = 'name',
  Network = 'network',
  ProtocolControlledValueUsd = 'protocolControlledValueUSD',
  SchemaVersion = 'schemaVersion',
  Slug = 'slug',
  SubgraphVersion = 'subgraphVersion',
  TotalPoolCount = 'totalPoolCount',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Type = 'type'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accountRewards?: Maybe<AccountRewards>;
  accountRewards_collection: Array<AccountRewards>;
  accounts: Array<Account>;
  activeAccount?: Maybe<ActiveAccount>;
  activeAccounts: Array<ActiveAccount>;
  ark?: Maybe<Ark>;
  arkDailySnapshot?: Maybe<ArkDailySnapshot>;
  arkDailySnapshots: Array<ArkDailySnapshot>;
  arkHourlySnapshot?: Maybe<ArkHourlySnapshot>;
  arkHourlySnapshots: Array<ArkHourlySnapshot>;
  arks: Array<Ark>;
  board?: Maybe<Board>;
  boards: Array<Board>;
  dailyInterestRate?: Maybe<DailyInterestRate>;
  dailyInterestRates: Array<DailyInterestRate>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  disembark?: Maybe<Disembark>;
  disembarks: Array<Disembark>;
  event?: Maybe<Event>;
  events: Array<Event>;
  financialsDailySnapshot?: Maybe<FinancialsDailySnapshot>;
  financialsDailySnapshots: Array<FinancialsDailySnapshot>;
  governanceRewardsManager?: Maybe<GovernanceRewardsManager>;
  governanceRewardsManagers: Array<GovernanceRewardsManager>;
  governanceStaking?: Maybe<GovernanceStaking>;
  governanceStakings: Array<GovernanceStaking>;
  hourlyInterestRate?: Maybe<HourlyInterestRate>;
  hourlyInterestRates: Array<HourlyInterestRate>;
  position?: Maybe<Position>;
  positionDailySnapshot?: Maybe<PositionDailySnapshot>;
  positionDailySnapshots: Array<PositionDailySnapshot>;
  positionHourlySnapshot?: Maybe<PositionHourlySnapshot>;
  positionHourlySnapshots: Array<PositionHourlySnapshot>;
  positionRewards?: Maybe<PositionRewards>;
  positionRewards_collection: Array<PositionRewards>;
  positionWeeklySnapshot?: Maybe<PositionWeeklySnapshot>;
  positionWeeklySnapshots: Array<PositionWeeklySnapshot>;
  positions: Array<Position>;
  postActionArkSnapshot?: Maybe<PostActionArkSnapshot>;
  postActionArkSnapshots: Array<PostActionArkSnapshot>;
  postActionVaultSnapshot?: Maybe<PostActionVaultSnapshot>;
  postActionVaultSnapshots: Array<PostActionVaultSnapshot>;
  protocol?: Maybe<Protocol>;
  protocols: Array<Protocol>;
  rebalance?: Maybe<Rebalance>;
  rebalances: Array<Rebalance>;
  rewardToken?: Maybe<RewardToken>;
  rewardTokens: Array<RewardToken>;
  rewardsManager?: Maybe<RewardsManager>;
  rewardsManagers: Array<RewardsManager>;
  staked?: Maybe<Staked>;
  stakeds: Array<Staked>;
  token?: Maybe<Token>;
  tokenPrice?: Maybe<TokenPrice>;
  tokenPrices: Array<TokenPrice>;
  tokens: Array<Token>;
  unstaked?: Maybe<Unstaked>;
  unstakeds: Array<Unstaked>;
  usageMetricsDailySnapshot?: Maybe<UsageMetricsDailySnapshot>;
  usageMetricsDailySnapshots: Array<UsageMetricsDailySnapshot>;
  usageMetricsHourlySnapshot?: Maybe<UsageMetricsHourlySnapshot>;
  usageMetricsHourlySnapshots: Array<UsageMetricsHourlySnapshot>;
  vault?: Maybe<Vault>;
  vaultDailySnapshot?: Maybe<VaultDailySnapshot>;
  vaultDailySnapshots: Array<VaultDailySnapshot>;
  vaultFee?: Maybe<VaultFee>;
  vaultFees: Array<VaultFee>;
  vaultHourlySnapshot?: Maybe<VaultHourlySnapshot>;
  vaultHourlySnapshots: Array<VaultHourlySnapshot>;
  vaultWeeklySnapshot?: Maybe<VaultWeeklySnapshot>;
  vaultWeeklySnapshots: Array<VaultWeeklySnapshot>;
  vaults: Array<Vault>;
  weeklyInterestRate?: Maybe<WeeklyInterestRate>;
  weeklyInterestRates: Array<WeeklyInterestRate>;
  withdraw?: Maybe<Withdraw>;
  withdraws: Array<Withdraw>;
  yieldAggregator?: Maybe<YieldAggregator>;
  yieldAggregators: Array<YieldAggregator>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountRewards_CollectionArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountRewards_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountRewards_Filter>;
};


export type QueryAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type QueryActiveAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryActiveAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ActiveAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ActiveAccount_Filter>;
};


export type QueryArkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryArkDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryArkDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ArkDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ArkDailySnapshot_Filter>;
};


export type QueryArkHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryArkHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ArkHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ArkHourlySnapshot_Filter>;
};


export type QueryArksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Ark_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Ark_Filter>;
};


export type QueryBoardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBoardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Board_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Board_Filter>;
};


export type QueryDailyInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDailyInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DailyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DailyInterestRate_Filter>;
};


export type QueryDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};


export type QueryDisembarkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDisembarksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Disembark_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Disembark_Filter>;
};


export type QueryEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Event_Filter>;
};


export type QueryFinancialsDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFinancialsDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FinancialsDailySnapshot_Filter>;
};


export type QueryGovernanceRewardsManagerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGovernanceRewardsManagersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GovernanceRewardsManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernanceRewardsManager_Filter>;
};


export type QueryGovernanceStakingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGovernanceStakingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GovernanceStaking_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernanceStaking_Filter>;
};


export type QueryHourlyInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryHourlyInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<HourlyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<HourlyInterestRate_Filter>;
};


export type QueryPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPositionDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPositionDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionDailySnapshot_Filter>;
};


export type QueryPositionHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPositionHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionHourlySnapshot_Filter>;
};


export type QueryPositionRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPositionRewards_CollectionArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionRewards_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionRewards_Filter>;
};


export type QueryPositionWeeklySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPositionWeeklySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionWeeklySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionWeeklySnapshot_Filter>;
};


export type QueryPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Position_Filter>;
};


export type QueryPostActionArkSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPostActionArkSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PostActionArkSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PostActionArkSnapshot_Filter>;
};


export type QueryPostActionVaultSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPostActionVaultSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PostActionVaultSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PostActionVaultSnapshot_Filter>;
};


export type QueryProtocolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProtocolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Protocol_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Protocol_Filter>;
};


export type QueryRebalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRebalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Rebalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rebalance_Filter>;
};


export type QueryRewardTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewardTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardToken_Filter>;
};


export type QueryRewardsManagerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewardsManagersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardsManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardsManager_Filter>;
};


export type QueryStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Staked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Staked_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenPrice_Filter>;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type QueryUnstakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUnstakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Unstaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unstaked_Filter>;
};


export type QueryUsageMetricsDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsageMetricsDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UsageMetricsDailySnapshot_Filter>;
};


export type QueryUsageMetricsHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsageMetricsHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UsageMetricsHourlySnapshot_Filter>;
};


export type QueryVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVaultDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVaultDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultDailySnapshot_Filter>;
};


export type QueryVaultFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVaultFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultFee_Filter>;
};


export type QueryVaultHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVaultHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultHourlySnapshot_Filter>;
};


export type QueryVaultWeeklySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVaultWeeklySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultWeeklySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultWeeklySnapshot_Filter>;
};


export type QueryVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vault_Filter>;
};


export type QueryWeeklyInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWeeklyInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WeeklyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WeeklyInterestRate_Filter>;
};


export type QueryWithdrawArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWithdrawsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdraw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdraw_Filter>;
};


export type QueryYieldAggregatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryYieldAggregatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<YieldAggregator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<YieldAggregator_Filter>;
};

export type Rebalance = {
  __typename?: 'Rebalance';
  /**  Amount of token deposited in native units  */
  amount: Scalars['BigInt']['output'];
  /**  Amount of token deposited in USD  */
  amountUSD: Scalars['BigDecimal']['output'];
  /**  Token rebalanced  */
  asset: Token;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Ark that we reblance from  */
  from: Ark;
  /**  Post action snapshot of the from ark  */
  fromPostAction: PostActionArkSnapshot;
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index }  */
  id: Scalars['ID']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  The protocol this transaction belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Ark that we reblance to  */
  to: Ark;
  /**  Post action snapshot of the to ark  */
  toPostAction: PostActionArkSnapshot;
  /**  The vault involving this transaction  */
  vault: Vault;
};

export type Rebalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Rebalance_Filter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Token_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  fromPostAction?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_?: InputMaybe<PostActionArkSnapshot_Filter>;
  fromPostAction_contains?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_gt?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_gte?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromPostAction_lt?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_lte?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_not?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_not_contains?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fromPostAction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_starts_with?: InputMaybe<Scalars['String']['input']>;
  fromPostAction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_?: InputMaybe<Ark_Filter>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Rebalance_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  toPostAction?: InputMaybe<Scalars['String']['input']>;
  toPostAction_?: InputMaybe<PostActionArkSnapshot_Filter>;
  toPostAction_contains?: InputMaybe<Scalars['String']['input']>;
  toPostAction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toPostAction_ends_with?: InputMaybe<Scalars['String']['input']>;
  toPostAction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toPostAction_gt?: InputMaybe<Scalars['String']['input']>;
  toPostAction_gte?: InputMaybe<Scalars['String']['input']>;
  toPostAction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toPostAction_lt?: InputMaybe<Scalars['String']['input']>;
  toPostAction_lte?: InputMaybe<Scalars['String']['input']>;
  toPostAction_not?: InputMaybe<Scalars['String']['input']>;
  toPostAction_not_contains?: InputMaybe<Scalars['String']['input']>;
  toPostAction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  toPostAction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  toPostAction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toPostAction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  toPostAction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  toPostAction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  toPostAction_starts_with?: InputMaybe<Scalars['String']['input']>;
  toPostAction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_?: InputMaybe<Ark_Filter>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Rebalance_OrderBy {
  Amount = 'amount',
  AmountUsd = 'amountUSD',
  Asset = 'asset',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLastPriceBlockNumber = 'asset__lastPriceBlockNumber',
  AssetLastPriceUsd = 'asset__lastPriceUSD',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  BlockNumber = 'blockNumber',
  From = 'from',
  FromPostAction = 'fromPostAction',
  FromPostActionApr = 'fromPostAction__apr',
  FromPostActionBlockNumber = 'fromPostAction__blockNumber',
  FromPostActionDepositLimit = 'fromPostAction__depositLimit',
  FromPostActionId = 'fromPostAction__id',
  FromPostActionInputTokenBalance = 'fromPostAction__inputTokenBalance',
  FromPostActionTimestamp = 'fromPostAction__timestamp',
  FromPostActionTotalValueLockedUsd = 'fromPostAction__totalValueLockedUSD',
  FromCumulativeDeposits = 'from___cumulativeDeposits',
  FromCumulativeWithdrawals = 'from___cumulativeWithdrawals',
  FromLastUpdateInputTokenBalance = 'from___lastUpdateInputTokenBalance',
  FromCalculatedApr = 'from__calculatedApr',
  FromCreatedBlockNumber = 'from__createdBlockNumber',
  FromCreatedTimestamp = 'from__createdTimestamp',
  FromCumulativeEarnings = 'from__cumulativeEarnings',
  FromCumulativeProtocolSideRevenueUsd = 'from__cumulativeProtocolSideRevenueUSD',
  FromCumulativeSupplySideRevenueUsd = 'from__cumulativeSupplySideRevenueUSD',
  FromCumulativeTotalRevenueUsd = 'from__cumulativeTotalRevenueUSD',
  FromDepositCap = 'from__depositCap',
  FromDepositLimit = 'from__depositLimit',
  FromDetails = 'from__details',
  FromId = 'from__id',
  FromInputTokenBalance = 'from__inputTokenBalance',
  FromLastUpdateTimestamp = 'from__lastUpdateTimestamp',
  FromMaxDepositPercentageOfTvl = 'from__maxDepositPercentageOfTVL',
  FromMaxRebalanceInflow = 'from__maxRebalanceInflow',
  FromMaxRebalanceOutflow = 'from__maxRebalanceOutflow',
  FromName = 'from__name',
  FromProductId = 'from__productId',
  FromRequiresKeeperData = 'from__requiresKeeperData',
  FromTotalValueLockedUsd = 'from__totalValueLockedUSD',
  Hash = 'hash',
  Id = 'id',
  LogIndex = 'logIndex',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  To = 'to',
  ToPostAction = 'toPostAction',
  ToPostActionApr = 'toPostAction__apr',
  ToPostActionBlockNumber = 'toPostAction__blockNumber',
  ToPostActionDepositLimit = 'toPostAction__depositLimit',
  ToPostActionId = 'toPostAction__id',
  ToPostActionInputTokenBalance = 'toPostAction__inputTokenBalance',
  ToPostActionTimestamp = 'toPostAction__timestamp',
  ToPostActionTotalValueLockedUsd = 'toPostAction__totalValueLockedUSD',
  ToCumulativeDeposits = 'to___cumulativeDeposits',
  ToCumulativeWithdrawals = 'to___cumulativeWithdrawals',
  ToLastUpdateInputTokenBalance = 'to___lastUpdateInputTokenBalance',
  ToCalculatedApr = 'to__calculatedApr',
  ToCreatedBlockNumber = 'to__createdBlockNumber',
  ToCreatedTimestamp = 'to__createdTimestamp',
  ToCumulativeEarnings = 'to__cumulativeEarnings',
  ToCumulativeProtocolSideRevenueUsd = 'to__cumulativeProtocolSideRevenueUSD',
  ToCumulativeSupplySideRevenueUsd = 'to__cumulativeSupplySideRevenueUSD',
  ToCumulativeTotalRevenueUsd = 'to__cumulativeTotalRevenueUSD',
  ToDepositCap = 'to__depositCap',
  ToDepositLimit = 'to__depositLimit',
  ToDetails = 'to__details',
  ToId = 'to__id',
  ToInputTokenBalance = 'to__inputTokenBalance',
  ToLastUpdateTimestamp = 'to__lastUpdateTimestamp',
  ToMaxDepositPercentageOfTvl = 'to__maxDepositPercentageOfTVL',
  ToMaxRebalanceInflow = 'to__maxRebalanceInflow',
  ToMaxRebalanceOutflow = 'to__maxRebalanceOutflow',
  ToName = 'to__name',
  ToProductId = 'to__productId',
  ToRequiresKeeperData = 'to__requiresKeeperData',
  ToTotalValueLockedUsd = 'to__totalValueLockedUSD',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type RewardToken = {
  __typename?: 'RewardToken';
  /**  { Reward token type }-{ Smart contract address of the reward token }  */
  id: Scalars['ID']['output'];
  /**  Reference to the actual token  */
  token: Token;
  /**  The type of the reward token  */
  type: RewardTokenType;
};

export enum RewardTokenType {
  /**  For reward tokens awarded to borrowers  */
  Borrow = 'BORROW',
  /**  For reward tokens awarded to LPs/lenders  */
  Deposit = 'DEPOSIT'
}

export type RewardToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RewardToken_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RewardToken_Filter>>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<RewardTokenType>;
  type_in?: InputMaybe<Array<RewardTokenType>>;
  type_not?: InputMaybe<RewardTokenType>;
  type_not_in?: InputMaybe<Array<RewardTokenType>>;
};

export enum RewardToken_OrderBy {
  Id = 'id',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenId = 'token__id',
  TokenLastPriceBlockNumber = 'token__lastPriceBlockNumber',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  Type = 'type'
}

export type RewardsManager = {
  __typename?: 'RewardsManager';
  id: Scalars['ID']['output'];
  vault: Vault;
};

export type RewardsManager_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RewardsManager_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RewardsManager_Filter>>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum RewardsManager_OrderBy {
  Id = 'id',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type Staked = Event & {
  __typename?: 'Staked';
  /**  Amount of token staked in native units  */
  amount: Scalars['BigInt']['output'];
  /**  Amount of token staked in USD  */
  amountUSD: Scalars['BigDecimal']['output'];
  /**  Token staked  */
  asset: Token;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Address that sent tokens  */
  from: Scalars['String']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the position  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Amount of input token in the position in USD  */
  inputTokenBalanceNormalizedUSD: Scalars['BigDecimal']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Position that this stake belongs to  */
  position: Position;
  /**  The protocol this transaction belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Address that received tokens  */
  to: Scalars['String']['output'];
  /**  The vault involving this transaction  */
  vault: Vault;
};

export type Staked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Staked_Filter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Token_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalizedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalizedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Staked_Filter>>>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Staked_OrderBy {
  Amount = 'amount',
  AmountUsd = 'amountUSD',
  Asset = 'asset',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLastPriceBlockNumber = 'asset__lastPriceBlockNumber',
  AssetLastPriceUsd = 'asset__lastPriceUSD',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  BlockNumber = 'blockNumber',
  From = 'from',
  Hash = 'hash',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalizedUsd = 'inputTokenBalanceNormalizedUSD',
  LogIndex = 'logIndex',
  Position = 'position',
  PositionClaimableSummerToken = 'position__claimableSummerToken',
  PositionClaimableSummerTokenNormalized = 'position__claimableSummerTokenNormalized',
  PositionClaimedSummerToken = 'position__claimedSummerToken',
  PositionClaimedSummerTokenNormalized = 'position__claimedSummerTokenNormalized',
  PositionCreatedBlockNumber = 'position__createdBlockNumber',
  PositionCreatedTimestamp = 'position__createdTimestamp',
  PositionId = 'position__id',
  PositionInputTokenBalance = 'position__inputTokenBalance',
  PositionInputTokenBalanceNormalized = 'position__inputTokenBalanceNormalized',
  PositionInputTokenBalanceNormalizedInUsd = 'position__inputTokenBalanceNormalizedInUSD',
  PositionInputTokenDeposits = 'position__inputTokenDeposits',
  PositionInputTokenDepositsNormalized = 'position__inputTokenDepositsNormalized',
  PositionInputTokenDepositsNormalizedInUsd = 'position__inputTokenDepositsNormalizedInUSD',
  PositionInputTokenWithdrawals = 'position__inputTokenWithdrawals',
  PositionInputTokenWithdrawalsNormalized = 'position__inputTokenWithdrawalsNormalized',
  PositionInputTokenWithdrawalsNormalizedInUsd = 'position__inputTokenWithdrawalsNormalizedInUSD',
  PositionOutputTokenBalance = 'position__outputTokenBalance',
  PositionStakedInputTokenBalance = 'position__stakedInputTokenBalance',
  PositionStakedInputTokenBalanceNormalized = 'position__stakedInputTokenBalanceNormalized',
  PositionStakedInputTokenBalanceNormalizedInUsd = 'position__stakedInputTokenBalanceNormalizedInUSD',
  PositionStakedOutputTokenBalance = 'position__stakedOutputTokenBalance',
  PositionUnstakedInputTokenBalance = 'position__unstakedInputTokenBalance',
  PositionUnstakedInputTokenBalanceNormalized = 'position__unstakedInputTokenBalanceNormalized',
  PositionUnstakedInputTokenBalanceNormalizedInUsd = 'position__unstakedInputTokenBalanceNormalizedInUSD',
  PositionUnstakedOutputTokenBalance = 'position__unstakedOutputTokenBalance',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  To = 'to',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  account?: Maybe<Account>;
  accountRewards?: Maybe<AccountRewards>;
  accountRewards_collection: Array<AccountRewards>;
  accounts: Array<Account>;
  activeAccount?: Maybe<ActiveAccount>;
  activeAccounts: Array<ActiveAccount>;
  ark?: Maybe<Ark>;
  arkDailySnapshot?: Maybe<ArkDailySnapshot>;
  arkDailySnapshots: Array<ArkDailySnapshot>;
  arkHourlySnapshot?: Maybe<ArkHourlySnapshot>;
  arkHourlySnapshots: Array<ArkHourlySnapshot>;
  arks: Array<Ark>;
  board?: Maybe<Board>;
  boards: Array<Board>;
  dailyInterestRate?: Maybe<DailyInterestRate>;
  dailyInterestRates: Array<DailyInterestRate>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  disembark?: Maybe<Disembark>;
  disembarks: Array<Disembark>;
  event?: Maybe<Event>;
  events: Array<Event>;
  financialsDailySnapshot?: Maybe<FinancialsDailySnapshot>;
  financialsDailySnapshots: Array<FinancialsDailySnapshot>;
  governanceRewardsManager?: Maybe<GovernanceRewardsManager>;
  governanceRewardsManagers: Array<GovernanceRewardsManager>;
  governanceStaking?: Maybe<GovernanceStaking>;
  governanceStakings: Array<GovernanceStaking>;
  hourlyInterestRate?: Maybe<HourlyInterestRate>;
  hourlyInterestRates: Array<HourlyInterestRate>;
  position?: Maybe<Position>;
  positionDailySnapshot?: Maybe<PositionDailySnapshot>;
  positionDailySnapshots: Array<PositionDailySnapshot>;
  positionHourlySnapshot?: Maybe<PositionHourlySnapshot>;
  positionHourlySnapshots: Array<PositionHourlySnapshot>;
  positionRewards?: Maybe<PositionRewards>;
  positionRewards_collection: Array<PositionRewards>;
  positionWeeklySnapshot?: Maybe<PositionWeeklySnapshot>;
  positionWeeklySnapshots: Array<PositionWeeklySnapshot>;
  positions: Array<Position>;
  postActionArkSnapshot?: Maybe<PostActionArkSnapshot>;
  postActionArkSnapshots: Array<PostActionArkSnapshot>;
  postActionVaultSnapshot?: Maybe<PostActionVaultSnapshot>;
  postActionVaultSnapshots: Array<PostActionVaultSnapshot>;
  protocol?: Maybe<Protocol>;
  protocols: Array<Protocol>;
  rebalance?: Maybe<Rebalance>;
  rebalances: Array<Rebalance>;
  rewardToken?: Maybe<RewardToken>;
  rewardTokens: Array<RewardToken>;
  rewardsManager?: Maybe<RewardsManager>;
  rewardsManagers: Array<RewardsManager>;
  staked?: Maybe<Staked>;
  stakeds: Array<Staked>;
  token?: Maybe<Token>;
  tokenPrice?: Maybe<TokenPrice>;
  tokenPrices: Array<TokenPrice>;
  tokens: Array<Token>;
  unstaked?: Maybe<Unstaked>;
  unstakeds: Array<Unstaked>;
  usageMetricsDailySnapshot?: Maybe<UsageMetricsDailySnapshot>;
  usageMetricsDailySnapshots: Array<UsageMetricsDailySnapshot>;
  usageMetricsHourlySnapshot?: Maybe<UsageMetricsHourlySnapshot>;
  usageMetricsHourlySnapshots: Array<UsageMetricsHourlySnapshot>;
  vault?: Maybe<Vault>;
  vaultDailySnapshot?: Maybe<VaultDailySnapshot>;
  vaultDailySnapshots: Array<VaultDailySnapshot>;
  vaultFee?: Maybe<VaultFee>;
  vaultFees: Array<VaultFee>;
  vaultHourlySnapshot?: Maybe<VaultHourlySnapshot>;
  vaultHourlySnapshots: Array<VaultHourlySnapshot>;
  vaultWeeklySnapshot?: Maybe<VaultWeeklySnapshot>;
  vaultWeeklySnapshots: Array<VaultWeeklySnapshot>;
  vaults: Array<Vault>;
  weeklyInterestRate?: Maybe<WeeklyInterestRate>;
  weeklyInterestRates: Array<WeeklyInterestRate>;
  withdraw?: Maybe<Withdraw>;
  withdraws: Array<Withdraw>;
  yieldAggregator?: Maybe<YieldAggregator>;
  yieldAggregators: Array<YieldAggregator>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountRewards_CollectionArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountRewards_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AccountRewards_Filter>;
};


export type SubscriptionAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Account_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Account_Filter>;
};


export type SubscriptionActiveAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionActiveAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ActiveAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ActiveAccount_Filter>;
};


export type SubscriptionArkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionArkDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionArkDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ArkDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ArkDailySnapshot_Filter>;
};


export type SubscriptionArkHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionArkHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ArkHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ArkHourlySnapshot_Filter>;
};


export type SubscriptionArksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Ark_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Ark_Filter>;
};


export type SubscriptionBoardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBoardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Board_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Board_Filter>;
};


export type SubscriptionDailyInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDailyInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DailyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DailyInterestRate_Filter>;
};


export type SubscriptionDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};


export type SubscriptionDisembarkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDisembarksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Disembark_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Disembark_Filter>;
};


export type SubscriptionEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Event_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Event_Filter>;
};


export type SubscriptionFinancialsDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFinancialsDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FinancialsDailySnapshot_Filter>;
};


export type SubscriptionGovernanceRewardsManagerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGovernanceRewardsManagersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GovernanceRewardsManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernanceRewardsManager_Filter>;
};


export type SubscriptionGovernanceStakingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGovernanceStakingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GovernanceStaking_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernanceStaking_Filter>;
};


export type SubscriptionHourlyInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionHourlyInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<HourlyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<HourlyInterestRate_Filter>;
};


export type SubscriptionPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPositionDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPositionDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionDailySnapshot_Filter>;
};


export type SubscriptionPositionHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPositionHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionHourlySnapshot_Filter>;
};


export type SubscriptionPositionRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPositionRewards_CollectionArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionRewards_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionRewards_Filter>;
};


export type SubscriptionPositionWeeklySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPositionWeeklySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PositionWeeklySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PositionWeeklySnapshot_Filter>;
};


export type SubscriptionPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Position_Filter>;
};


export type SubscriptionPostActionArkSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPostActionArkSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PostActionArkSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PostActionArkSnapshot_Filter>;
};


export type SubscriptionPostActionVaultSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPostActionVaultSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PostActionVaultSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PostActionVaultSnapshot_Filter>;
};


export type SubscriptionProtocolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProtocolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Protocol_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Protocol_Filter>;
};


export type SubscriptionRebalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRebalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Rebalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rebalance_Filter>;
};


export type SubscriptionRewardTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRewardTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardToken_Filter>;
};


export type SubscriptionRewardsManagerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRewardsManagersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardsManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardsManager_Filter>;
};


export type SubscriptionStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Staked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Staked_Filter>;
};


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenPrice_Filter>;
};


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type SubscriptionUnstakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUnstakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Unstaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unstaked_Filter>;
};


export type SubscriptionUsageMetricsDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUsageMetricsDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UsageMetricsDailySnapshot_Filter>;
};


export type SubscriptionUsageMetricsHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUsageMetricsHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UsageMetricsHourlySnapshot_Filter>;
};


export type SubscriptionVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVaultDailySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVaultDailySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultDailySnapshot_Filter>;
};


export type SubscriptionVaultFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVaultFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultFee_Filter>;
};


export type SubscriptionVaultHourlySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVaultHourlySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultHourlySnapshot_Filter>;
};


export type SubscriptionVaultWeeklySnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVaultWeeklySnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultWeeklySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultWeeklySnapshot_Filter>;
};


export type SubscriptionVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vault_Filter>;
};


export type SubscriptionWeeklyInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWeeklyInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WeeklyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WeeklyInterestRate_Filter>;
};


export type SubscriptionWithdrawArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWithdrawsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdraw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdraw_Filter>;
};


export type SubscriptionYieldAggregatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionYieldAggregatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<YieldAggregator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<YieldAggregator_Filter>;
};

export type Token = {
  __typename?: 'Token';
  /**  The number of decimal places this token uses, default to 18  */
  decimals: Scalars['Int']['output'];
  /**  Smart contract address of the token  */
  id: Scalars['ID']['output'];
  /**  Optional field to track the block number of the last token price  */
  lastPriceBlockNumber?: Maybe<Scalars['BigInt']['output']>;
  /**  Optional field to track the price of a token, mostly for caching purposes  */
  lastPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Name of the token, mirrored from the smart contract  */
  name: Scalars['String']['output'];
  /**  Symbol of the token, mirrored from the smart contract  */
  symbol: Scalars['String']['output'];
};

export type TokenPrice = {
  __typename?: 'TokenPrice';
  blockNumber: Scalars['BigInt']['output'];
  id: Scalars['Bytes']['output'];
  oracle: Scalars['String']['output'];
  price: Scalars['BigDecimal']['output'];
  token: Token;
};

export type TokenPrice_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenPrice_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenPrice_Filter>>>;
  oracle?: InputMaybe<Scalars['String']['input']>;
  oracle_contains?: InputMaybe<Scalars['String']['input']>;
  oracle_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  oracle_ends_with?: InputMaybe<Scalars['String']['input']>;
  oracle_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  oracle_gt?: InputMaybe<Scalars['String']['input']>;
  oracle_gte?: InputMaybe<Scalars['String']['input']>;
  oracle_in?: InputMaybe<Array<Scalars['String']['input']>>;
  oracle_lt?: InputMaybe<Scalars['String']['input']>;
  oracle_lte?: InputMaybe<Scalars['String']['input']>;
  oracle_not?: InputMaybe<Scalars['String']['input']>;
  oracle_not_contains?: InputMaybe<Scalars['String']['input']>;
  oracle_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  oracle_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  oracle_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  oracle_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  oracle_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  oracle_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  oracle_starts_with?: InputMaybe<Scalars['String']['input']>;
  oracle_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum TokenPrice_OrderBy {
  BlockNumber = 'blockNumber',
  Id = 'id',
  Oracle = 'oracle',
  Price = 'price',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenId = 'token__id',
  TokenLastPriceBlockNumber = 'token__lastPriceBlockNumber',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol'
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastPriceBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastPriceBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastPriceBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Token_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  LastPriceBlockNumber = 'lastPriceBlockNumber',
  LastPriceUsd = 'lastPriceUSD',
  Name = 'name',
  Symbol = 'symbol'
}

export type Unstaked = Event & {
  __typename?: 'Unstaked';
  /**  Amount of token unstaked in native units  */
  amount: Scalars['BigInt']['output'];
  /**  Amount of token unstaked in USD  */
  amountUSD: Scalars['BigDecimal']['output'];
  /**  Token withdrawn  */
  asset: Token;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Address that sent tokens  */
  from: Scalars['String']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the position  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Amount of input token in the position in USD  */
  inputTokenBalanceNormalizedUSD: Scalars['BigDecimal']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Position that this unstake belongs to  */
  position: Position;
  /**  The protocol this transaction belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Address that received tokens  */
  to: Scalars['String']['output'];
  /**  The vault involving this transaction  */
  vault: Vault;
};

export type Unstaked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Unstaked_Filter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Token_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalizedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalizedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Unstaked_Filter>>>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Unstaked_OrderBy {
  Amount = 'amount',
  AmountUsd = 'amountUSD',
  Asset = 'asset',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLastPriceBlockNumber = 'asset__lastPriceBlockNumber',
  AssetLastPriceUsd = 'asset__lastPriceUSD',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  BlockNumber = 'blockNumber',
  From = 'from',
  Hash = 'hash',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalizedUsd = 'inputTokenBalanceNormalizedUSD',
  LogIndex = 'logIndex',
  Position = 'position',
  PositionClaimableSummerToken = 'position__claimableSummerToken',
  PositionClaimableSummerTokenNormalized = 'position__claimableSummerTokenNormalized',
  PositionClaimedSummerToken = 'position__claimedSummerToken',
  PositionClaimedSummerTokenNormalized = 'position__claimedSummerTokenNormalized',
  PositionCreatedBlockNumber = 'position__createdBlockNumber',
  PositionCreatedTimestamp = 'position__createdTimestamp',
  PositionId = 'position__id',
  PositionInputTokenBalance = 'position__inputTokenBalance',
  PositionInputTokenBalanceNormalized = 'position__inputTokenBalanceNormalized',
  PositionInputTokenBalanceNormalizedInUsd = 'position__inputTokenBalanceNormalizedInUSD',
  PositionInputTokenDeposits = 'position__inputTokenDeposits',
  PositionInputTokenDepositsNormalized = 'position__inputTokenDepositsNormalized',
  PositionInputTokenDepositsNormalizedInUsd = 'position__inputTokenDepositsNormalizedInUSD',
  PositionInputTokenWithdrawals = 'position__inputTokenWithdrawals',
  PositionInputTokenWithdrawalsNormalized = 'position__inputTokenWithdrawalsNormalized',
  PositionInputTokenWithdrawalsNormalizedInUsd = 'position__inputTokenWithdrawalsNormalizedInUSD',
  PositionOutputTokenBalance = 'position__outputTokenBalance',
  PositionStakedInputTokenBalance = 'position__stakedInputTokenBalance',
  PositionStakedInputTokenBalanceNormalized = 'position__stakedInputTokenBalanceNormalized',
  PositionStakedInputTokenBalanceNormalizedInUsd = 'position__stakedInputTokenBalanceNormalizedInUSD',
  PositionStakedOutputTokenBalance = 'position__stakedOutputTokenBalance',
  PositionUnstakedInputTokenBalance = 'position__unstakedInputTokenBalance',
  PositionUnstakedInputTokenBalanceNormalized = 'position__unstakedInputTokenBalanceNormalized',
  PositionUnstakedInputTokenBalanceNormalizedInUsd = 'position__unstakedInputTokenBalanceNormalizedInUSD',
  PositionUnstakedOutputTokenBalance = 'position__unstakedOutputTokenBalance',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  To = 'to',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type UsageMetricsDailySnapshot = {
  __typename?: 'UsageMetricsDailySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Number of unique daily active users  */
  dailyActiveUsers: Scalars['Int']['output'];
  /**  Total number of deposits in a day  */
  dailyDepositCount: Scalars['Int']['output'];
  /**  Total number of transactions occurred in a day. Transactions include all entities that implement the Event interface.  */
  dailyTransactionCount: Scalars['Int']['output'];
  /**  Total number of withdrawals in a day  */
  dailyWithdrawCount: Scalars['Int']['output'];
  /**  ID is # of days since Unix epoch time  */
  id: Scalars['ID']['output'];
  /**  Protocol this snapshot is associated with  */
  protocol: YieldAggregator;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Total number of pools  */
  totalPoolCount: Scalars['Int']['output'];
};

export type UsageMetricsDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UsageMetricsDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  dailyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyDepositCount?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyDepositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyDepositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyTransactionCount?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyTransactionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyTransactionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyWithdrawCount?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyWithdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  dailyWithdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UsageMetricsDailySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalPoolCount?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalPoolCount_lt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_lte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_not?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum UsageMetricsDailySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  DailyActiveUsers = 'dailyActiveUsers',
  DailyDepositCount = 'dailyDepositCount',
  DailyTransactionCount = 'dailyTransactionCount',
  DailyWithdrawCount = 'dailyWithdrawCount',
  Id = 'id',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  TotalPoolCount = 'totalPoolCount'
}

export type UsageMetricsHourlySnapshot = {
  __typename?: 'UsageMetricsHourlySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Number of unique hourly active users  */
  hourlyActiveUsers: Scalars['Int']['output'];
  /**  Total number of deposits in an hour  */
  hourlyDepositCount: Scalars['Int']['output'];
  /**  Total number of transactions occurred in an hour. Transactions include all entities that implement the Event interface.  */
  hourlyTransactionCount: Scalars['Int']['output'];
  /**  Total number of withdrawals in an hour  */
  hourlyWithdrawCount: Scalars['Int']['output'];
  /**  { # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Protocol this snapshot is associated with  */
  protocol: YieldAggregator;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
};

export type UsageMetricsHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UsageMetricsHourlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyActiveUsers?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyActiveUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyActiveUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyDepositCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyDepositCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyDepositCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyTransactionCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyTransactionCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyTransactionCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyWithdrawCount?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_gt?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_gte?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  hourlyWithdrawCount_lt?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_lte?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_not?: InputMaybe<Scalars['Int']['input']>;
  hourlyWithdrawCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UsageMetricsHourlySnapshot_Filter>>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum UsageMetricsHourlySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  HourlyActiveUsers = 'hourlyActiveUsers',
  HourlyDepositCount = 'hourlyDepositCount',
  HourlyTransactionCount = 'hourlyTransactionCount',
  HourlyWithdrawCount = 'hourlyWithdrawCount',
  Id = 'id',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp'
}

export type Vault = {
  __typename?: 'Vault';
  actionSnapshots: Array<PostActionVaultSnapshot>;
  apr7d: Scalars['BigDecimal']['output'];
  apr30d: Scalars['BigDecimal']['output'];
  apr90d: Scalars['BigDecimal']['output'];
  apr180d: Scalars['BigDecimal']['output'];
  apr365d: Scalars['BigDecimal']['output'];
  aprValues: Array<Scalars['BigDecimal']['output']>;
  arks: Array<Ark>;
  arksArray: Array<Ark>;
  bufferArk?: Maybe<Ark>;
  /**  APR based on revenue between last two snapshots  */
  calculatedApr: Scalars['BigDecimal']['output'];
  /**  Creation block number  */
  createdBlockNumber: Scalars['BigInt']['output'];
  /**  Creation timestamp  */
  createdTimestamp: Scalars['BigInt']['output'];
  /**  All revenue generated by the vault, accrued to the protocol.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault, accrued to the supply side.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  dailyInterestRates: Array<DailyInterestRate>;
  /**  Vault daily snapshots  */
  dailySnapshots: Array<VaultDailySnapshot>;
  /**  Some vaults have a deposit cap. This is in input token amount  */
  depositCap: Scalars['BigInt']['output'];
  /**  DEPRECATED (use depositCap instead): Some vaults have a deposit cap. This is in input token amount  */
  depositLimit: Scalars['BigInt']['output'];
  /**  All deposits made to this vault  */
  deposits: Array<Deposit>;
  /**  Details of the Fleet Commander  */
  details?: Maybe<Scalars['String']['output']>;
  /**  fees incurred to the user  */
  fees: Array<VaultFee>;
  hourlyInterestRates: Array<HourlyInterestRate>;
  /**  Vault hourly snapshots  */
  hourlySnapshots: Array<VaultHourlySnapshot>;
  /**  Smart contract address of the vault  */
  id: Scalars['ID']['output'];
  /**  Token that need to be deposited to take a position in protocol  */
  inputToken: Token;
  /**  Amount of input token in the pool  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Price of input token in USD  */
  inputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  lastUpdatePricePerShare: Scalars['BigDecimal']['output'];
  lastUpdateTimestamp: Scalars['BigInt']['output'];
  /**  Some vaults have a maximum number of rebalance operations.  */
  maxRebalanceOperations: Scalars['BigInt']['output'];
  /**  Some vaults have a minimum buffer balance. This is in input token amount  */
  minimumBufferBalance: Scalars['BigInt']['output'];
  /**  Name of liquidity pool (e.g. Curve.fi DAI/USDC/USDT)  */
  name?: Maybe<Scalars['String']['output']>;
  /**  Token that is minted to track ownership of position in protocol  */
  outputToken?: Maybe<Token>;
  /**  Price per share of output token in USD  */
  outputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Total supply of output token  */
  outputTokenSupply: Scalars['BigInt']['output'];
  positions: Array<Position>;
  /**  Amount of input token per full share of output token. Usually corresponds to the value of `pricePerShare` or `pricePerFullShare` in the vault contract.  */
  pricePerShare?: Maybe<Scalars['BigDecimal']['output']>;
  /**  The protocol this vault belongs to  */
  protocol: YieldAggregator;
  rebalanceCount: Scalars['BigInt']['output'];
  rebalances: Array<Rebalance>;
  /**  Per-block reward token emission as of the current block normalized to a day, in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmount: Array<Scalars['BigInt']['output']>;
  /**  Per-block reward token emission as of the current block normalized to a day, in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmountsPerOutputToken: Array<Scalars['BigInt']['output']>;
  /**  Duration of the reward token emission in seconds  */
  rewardTokenEmissionsFinish: Array<Scalars['BigInt']['output']>;
  /**  Per-block reward token emission as of the current block normalized to a day, in USD value. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsUSD?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /**  Aditional tokens that are given as reward for position in a protocol, usually in liquidity mining programs. e.g. SUSHI in the Onsen program, MATIC for Aave Polygon  */
  rewardTokens: Array<RewardToken>;
  rewardsManager: RewardsManager;
  /**  Total supply of output tokens that are staked (usually in the MasterChef contract). Used to calculate reward APY.  */
  stakedOutputTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Address of the staking rewards manager  */
  stakingRewardsManager: Scalars['Bytes']['output'];
  /**  Symbol of liquidity pool (e.g. 3CRV)  */
  symbol?: Maybe<Scalars['String']['output']>;
  tipRate: Scalars['BigInt']['output'];
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  weeklyInterestRates: Array<WeeklyInterestRate>;
  /**  Vault weekly snapshots  */
  weeklySnapshots: Array<VaultWeeklySnapshot>;
  /**  Total withdrawable assets  */
  withdrawableTotalAssets?: Maybe<Scalars['BigInt']['output']>;
  /**  Total withdrawable assets in USD  */
  withdrawableTotalAssetsUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  All withdrawals made from this vault  */
  withdraws: Array<Withdraw>;
};


export type VaultActionSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PostActionVaultSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PostActionVaultSnapshot_Filter>;
};


export type VaultArksArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Ark_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Ark_Filter>;
};


export type VaultArksArrayArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Ark_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Ark_Filter>;
};


export type VaultDailyInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DailyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DailyInterestRate_Filter>;
};


export type VaultDailySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VaultDailySnapshot_Filter>;
};


export type VaultDepositsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Deposit_Filter>;
};


export type VaultFeesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VaultFee_Filter>;
};


export type VaultHourlyInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<HourlyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<HourlyInterestRate_Filter>;
};


export type VaultHourlySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VaultHourlySnapshot_Filter>;
};


export type VaultPositionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Position_Filter>;
};


export type VaultRebalancesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Rebalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Rebalance_Filter>;
};


export type VaultRewardTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RewardToken_Filter>;
};


export type VaultWeeklyInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WeeklyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WeeklyInterestRate_Filter>;
};


export type VaultWeeklySnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultWeeklySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VaultWeeklySnapshot_Filter>;
};


export type VaultWithdrawsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Withdraw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Withdraw_Filter>;
};

export type VaultDailySnapshot = {
  __typename?: 'VaultDailySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  APR based on last day's revenue  */
  calculatedApr: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault, accrued to the protocol.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault, accrued to the supply side.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Daily revenue generated by the vault, accrued to the protocol.  */
  dailyProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Daily revenue generated by the vault, accrued to the supply side.  */
  dailySupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Daily revenue generated by the vault.  */
  dailyTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  { Smart contract address of the vault }-{ # of days since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the pool  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Amount of input token in the pool normalized  */
  inputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Price of input token in USD  */
  inputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Price per share of output token in USD  */
  outputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Total supply of output token  */
  outputTokenSupply: Scalars['BigInt']['output'];
  /**  Amount of input token per full share of output token. Usually corresponds to the value of `pricePerShare` or `pricePerFullShare` in the vault contract.  */
  pricePerShare?: Maybe<Scalars['BigDecimal']['output']>;
  /**  The protocol this snapshot belongs to  */
  protocol: YieldAggregator;
  /**  Per-block reward token emission as of the current block normalized to a day, in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmount?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Per-block reward token emission as of the current block normalized to a day, in USD value. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsUSD?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /**  Total supply of output tokens that are staked (usually in the MasterChef contract). Used to calculate reward APY.  */
  stakedOutputTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The vault this snapshot belongs to  */
  vault: Vault;
};

export type VaultDailySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VaultDailySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  calculatedApr?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  calculatedApr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailySupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailySupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dailyTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VaultDailySnapshot_Filter>>>;
  outputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerShare?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pricePerShare_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardTokenEmissionsAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedOutputTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedOutputTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum VaultDailySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CalculatedApr = 'calculatedApr',
  CumulativeProtocolSideRevenueUsd = 'cumulativeProtocolSideRevenueUSD',
  CumulativeSupplySideRevenueUsd = 'cumulativeSupplySideRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  DailyProtocolSideRevenueUsd = 'dailyProtocolSideRevenueUSD',
  DailySupplySideRevenueUsd = 'dailySupplySideRevenueUSD',
  DailyTotalRevenueUsd = 'dailyTotalRevenueUSD',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalized = 'inputTokenBalanceNormalized',
  InputTokenPriceUsd = 'inputTokenPriceUSD',
  OutputTokenPriceUsd = 'outputTokenPriceUSD',
  OutputTokenSupply = 'outputTokenSupply',
  PricePerShare = 'pricePerShare',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  RewardTokenEmissionsAmount = 'rewardTokenEmissionsAmount',
  RewardTokenEmissionsUsd = 'rewardTokenEmissionsUSD',
  StakedOutputTokenAmount = 'stakedOutputTokenAmount',
  Timestamp = 'timestamp',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type VaultFee = {
  __typename?: 'VaultFee';
  /**  Block number of the transaction  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Fee as a percentage of the trade (swap) amount. Does not always apply  */
  feePercentage?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Type of fee this vault uses  */
  feeType: VaultFeeType;
  /**  { Vault fee type }-{ Vault address }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token that is charged for the fee  */
  inputTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Amount of input token that is charged for the fee, normalized in USD  */
  inputTokenAmountNormalizedInUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Amount of output token that is charged for the fee  */
  outputTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Timestamp of the transaction  */
  timestamp: Scalars['BigInt']['output'];
  /**  Token that is charged for the fee  */
  token: Token;
  /**  Vault that is charged for the fee  */
  vault: Vault;
};

export enum VaultFeeType {
  /**  One-time fee charged by the protocol during deposit, in percentages of the deposit token  */
  DepositFee = 'DEPOSIT_FEE',
  /**  Fees charged by the protocol on a periodic basis, in percentages of the total principal  */
  ManagementFee = 'MANAGEMENT_FEE',
  /**  Fees charged by the protocol during harvest, in percentages of the interest accrued  */
  PerformanceFee = 'PERFORMANCE_FEE',
  /**  One-time fee charged by the protocol during withdrawal, in percentages of the withdrawal token  */
  WithdrawalFee = 'WITHDRAWAL_FEE'
}

export type VaultFee_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VaultFee_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feePercentage?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feePercentage_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feePercentage_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeType?: InputMaybe<VaultFeeType>;
  feeType_in?: InputMaybe<Array<VaultFeeType>>;
  feeType_not?: InputMaybe<VaultFeeType>;
  feeType_not_in?: InputMaybe<Array<VaultFeeType>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenAmountNormalizedInUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenAmountNormalizedInUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenAmountNormalizedInUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenAmountNormalizedInUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenAmountNormalizedInUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenAmountNormalizedInUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenAmountNormalizedInUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenAmountNormalizedInUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VaultFee_Filter>>>;
  outputTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum VaultFee_OrderBy {
  BlockNumber = 'blockNumber',
  FeePercentage = 'feePercentage',
  FeeType = 'feeType',
  Id = 'id',
  InputTokenAmount = 'inputTokenAmount',
  InputTokenAmountNormalizedInUsd = 'inputTokenAmountNormalizedInUSD',
  OutputTokenAmount = 'outputTokenAmount',
  Timestamp = 'timestamp',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenId = 'token__id',
  TokenLastPriceBlockNumber = 'token__lastPriceBlockNumber',
  TokenLastPriceUsd = 'token__lastPriceUSD',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type VaultHourlySnapshot = {
  __typename?: 'VaultHourlySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  APR based on last hour's revenue  */
  calculatedApr: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault, accrued to the protocol.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault, accrued to the supply side.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Hourly revenue generated by the vault, accrued to the protocol.  */
  hourlyProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Hourly revenue generated by the vault, accrued to the supply side.  */
  hourlySupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Hourly revenue generated by the vault.  */
  hourlyTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  { Smart contract address of the vault }-{ # of hours since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the pool  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Amount of input token in the position normalized  */
  inputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Price of input token in USD  */
  inputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Price per share of output token in USD  */
  outputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Total supply of output token  */
  outputTokenSupply: Scalars['BigInt']['output'];
  /**  Amount of input token per full share of output token. Usually corresponds to the value of `pricePerShare` or `pricePerFullShare` in the vault contract.  */
  pricePerShare?: Maybe<Scalars['BigDecimal']['output']>;
  /**  The protocol this snapshot belongs to  */
  protocol: YieldAggregator;
  /**  Per-block reward token emission as of the current block normalized to a day (not hour), in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmount?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Per-block reward token emission as of the current block normalized to a day (not hour), in USD value. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsUSD?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /**  Total supply of output tokens that are staked (usually in the MasterChef contract). Used to calculate reward APY.  */
  stakedOutputTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The vault this snapshot belongs to  */
  vault: Vault;
};

export type VaultHourlySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VaultHourlySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  calculatedApr?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  calculatedApr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlySupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlySupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlySupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  hourlyTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  hourlyTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VaultHourlySnapshot_Filter>>>;
  outputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerShare?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pricePerShare_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardTokenEmissionsAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedOutputTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedOutputTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum VaultHourlySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CalculatedApr = 'calculatedApr',
  CumulativeProtocolSideRevenueUsd = 'cumulativeProtocolSideRevenueUSD',
  CumulativeSupplySideRevenueUsd = 'cumulativeSupplySideRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  HourlyProtocolSideRevenueUsd = 'hourlyProtocolSideRevenueUSD',
  HourlySupplySideRevenueUsd = 'hourlySupplySideRevenueUSD',
  HourlyTotalRevenueUsd = 'hourlyTotalRevenueUSD',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalized = 'inputTokenBalanceNormalized',
  InputTokenPriceUsd = 'inputTokenPriceUSD',
  OutputTokenPriceUsd = 'outputTokenPriceUSD',
  OutputTokenSupply = 'outputTokenSupply',
  PricePerShare = 'pricePerShare',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  RewardTokenEmissionsAmount = 'rewardTokenEmissionsAmount',
  RewardTokenEmissionsUsd = 'rewardTokenEmissionsUSD',
  StakedOutputTokenAmount = 'stakedOutputTokenAmount',
  Timestamp = 'timestamp',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type VaultWeeklySnapshot = {
  __typename?: 'VaultWeeklySnapshot';
  /**  Block number of this snapshot  */
  blockNumber: Scalars['BigInt']['output'];
  /**  APR based on last week's revenue  */
  calculatedApr: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault, accrued to the protocol.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault, accrued to the supply side.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the vault.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  { Smart contract address of the vault }-{ # of weeks since Unix epoch time }  */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the pool  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Amount of input token in the pool normalized  */
  inputTokenBalanceNormalized: Scalars['BigDecimal']['output'];
  /**  Price of input token in USD  */
  inputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Price per share of output token in USD  */
  outputTokenPriceUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Total supply of output token  */
  outputTokenSupply: Scalars['BigInt']['output'];
  /**  Amount of input token per full share of output token. Usually corresponds to the value of `pricePerShare` or `pricePerFullShare` in the vault contract.  */
  pricePerShare?: Maybe<Scalars['BigDecimal']['output']>;
  /**  The protocol this snapshot belongs to  */
  protocol: YieldAggregator;
  /**  Per-block reward token emission as of the current block normalized to a day, in token's native amount. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsAmount?: Maybe<Array<Scalars['BigInt']['output']>>;
  /**  Per-block reward token emission as of the current block normalized to a day, in USD value. This should be ideally calculated as the theoretical rate instead of the realized amount.  */
  rewardTokenEmissionsUSD?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /**  Total supply of output tokens that are staked (usually in the MasterChef contract). Used to calculate reward APY.  */
  stakedOutputTokenAmount?: Maybe<Scalars['BigInt']['output']>;
  /**  Timestamp of this snapshot  */
  timestamp: Scalars['BigInt']['output'];
  /**  Current TVL (Total Value Locked) of this pool in USD  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The vault this snapshot belongs to  */
  vault: Vault;
  /**  Weekly revenue generated by the vault, accrued to the protocol.  */
  weeklyProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Weekly revenue generated by the vault, accrued to the supply side.  */
  weeklySupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Weekly revenue generated by the vault.  */
  weeklyTotalRevenueUSD: Scalars['BigDecimal']['output'];
};

export type VaultWeeklySnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VaultWeeklySnapshot_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  calculatedApr?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  calculatedApr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalized?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalized_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalized_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VaultWeeklySnapshot_Filter>>>;
  outputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerShare?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pricePerShare_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rewardTokenEmissionsAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedOutputTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedOutputTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weeklyProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weeklyProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weeklySupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklySupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklySupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklySupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weeklySupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklySupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklySupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklySupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weeklyTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weeklyTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  weeklyTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export enum VaultWeeklySnapshot_OrderBy {
  BlockNumber = 'blockNumber',
  CalculatedApr = 'calculatedApr',
  CumulativeProtocolSideRevenueUsd = 'cumulativeProtocolSideRevenueUSD',
  CumulativeSupplySideRevenueUsd = 'cumulativeSupplySideRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalized = 'inputTokenBalanceNormalized',
  InputTokenPriceUsd = 'inputTokenPriceUSD',
  OutputTokenPriceUsd = 'outputTokenPriceUSD',
  OutputTokenSupply = 'outputTokenSupply',
  PricePerShare = 'pricePerShare',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  RewardTokenEmissionsAmount = 'rewardTokenEmissionsAmount',
  RewardTokenEmissionsUsd = 'rewardTokenEmissionsUSD',
  StakedOutputTokenAmount = 'stakedOutputTokenAmount',
  Timestamp = 'timestamp',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD',
  WeeklyProtocolSideRevenueUsd = 'weeklyProtocolSideRevenueUSD',
  WeeklySupplySideRevenueUsd = 'weeklySupplySideRevenueUSD',
  WeeklyTotalRevenueUsd = 'weeklyTotalRevenueUSD'
}

export type Vault_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  actionSnapshots_?: InputMaybe<PostActionVaultSnapshot_Filter>;
  and?: InputMaybe<Array<InputMaybe<Vault_Filter>>>;
  apr7d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr7d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr7d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr7d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr7d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr7d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr7d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr7d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr30d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr30d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr30d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr30d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr30d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr30d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr30d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr30d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr90d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr90d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr90d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr90d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr90d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr90d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr90d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr90d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr180d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr180d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr180d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr180d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr180d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr180d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr180d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr180d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr365d?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr365d_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr365d_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr365d_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  apr365d_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr365d_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr365d_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  apr365d_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  aprValues?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  aprValues_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  aprValues_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  aprValues_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  aprValues_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  aprValues_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  arksArray?: InputMaybe<Array<Scalars['String']['input']>>;
  arksArray_?: InputMaybe<Ark_Filter>;
  arksArray_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  arksArray_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  arksArray_not?: InputMaybe<Array<Scalars['String']['input']>>;
  arksArray_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  arksArray_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  arks_?: InputMaybe<Ark_Filter>;
  bufferArk?: InputMaybe<Scalars['String']['input']>;
  bufferArk_?: InputMaybe<Ark_Filter>;
  bufferArk_contains?: InputMaybe<Scalars['String']['input']>;
  bufferArk_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bufferArk_ends_with?: InputMaybe<Scalars['String']['input']>;
  bufferArk_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bufferArk_gt?: InputMaybe<Scalars['String']['input']>;
  bufferArk_gte?: InputMaybe<Scalars['String']['input']>;
  bufferArk_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bufferArk_lt?: InputMaybe<Scalars['String']['input']>;
  bufferArk_lte?: InputMaybe<Scalars['String']['input']>;
  bufferArk_not?: InputMaybe<Scalars['String']['input']>;
  bufferArk_not_contains?: InputMaybe<Scalars['String']['input']>;
  bufferArk_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bufferArk_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  bufferArk_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bufferArk_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bufferArk_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  bufferArk_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bufferArk_starts_with?: InputMaybe<Scalars['String']['input']>;
  bufferArk_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  calculatedApr?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  calculatedApr_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  calculatedApr_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  createdBlockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dailyInterestRates_?: InputMaybe<DailyInterestRate_Filter>;
  dailySnapshots_?: InputMaybe<VaultDailySnapshot_Filter>;
  depositCap?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositCap_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositCap_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositLimit?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deposits_?: InputMaybe<Deposit_Filter>;
  details?: InputMaybe<Scalars['String']['input']>;
  details_contains?: InputMaybe<Scalars['String']['input']>;
  details_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  details_ends_with?: InputMaybe<Scalars['String']['input']>;
  details_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  details_gt?: InputMaybe<Scalars['String']['input']>;
  details_gte?: InputMaybe<Scalars['String']['input']>;
  details_in?: InputMaybe<Array<Scalars['String']['input']>>;
  details_lt?: InputMaybe<Scalars['String']['input']>;
  details_lte?: InputMaybe<Scalars['String']['input']>;
  details_not?: InputMaybe<Scalars['String']['input']>;
  details_not_contains?: InputMaybe<Scalars['String']['input']>;
  details_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  details_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  details_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  details_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  details_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  details_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  details_starts_with?: InputMaybe<Scalars['String']['input']>;
  details_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fees_?: InputMaybe<VaultFee_Filter>;
  hourlyInterestRates_?: InputMaybe<HourlyInterestRate_Filter>;
  hourlySnapshots_?: InputMaybe<VaultHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputToken?: InputMaybe<Scalars['String']['input']>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputToken_?: InputMaybe<Token_Filter>;
  inputToken_contains?: InputMaybe<Scalars['String']['input']>;
  inputToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  inputToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_gt?: InputMaybe<Scalars['String']['input']>;
  inputToken_gte?: InputMaybe<Scalars['String']['input']>;
  inputToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  inputToken_lt?: InputMaybe<Scalars['String']['input']>;
  inputToken_lte?: InputMaybe<Scalars['String']['input']>;
  inputToken_not?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  inputToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  inputToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inputToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  inputToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastUpdatePricePerShare?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastUpdatePricePerShare_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastUpdatePricePerShare_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastUpdatePricePerShare_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdatePricePerShare_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastUpdatePricePerShare_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastUpdatePricePerShare_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastUpdatePricePerShare_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxRebalanceOperations?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOperations_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOperations_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOperations_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxRebalanceOperations_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOperations_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOperations_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxRebalanceOperations_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumBufferBalance?: InputMaybe<Scalars['BigInt']['input']>;
  minimumBufferBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumBufferBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumBufferBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumBufferBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minimumBufferBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minimumBufferBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  minimumBufferBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Vault_Filter>>>;
  outputToken?: InputMaybe<Scalars['String']['input']>;
  outputTokenPriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenPriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  outputTokenPriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  outputTokenSupply?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputTokenSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  outputTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  outputToken_?: InputMaybe<Token_Filter>;
  outputToken_contains?: InputMaybe<Scalars['String']['input']>;
  outputToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  outputToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  outputToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  outputToken_gt?: InputMaybe<Scalars['String']['input']>;
  outputToken_gte?: InputMaybe<Scalars['String']['input']>;
  outputToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  outputToken_lt?: InputMaybe<Scalars['String']['input']>;
  outputToken_lte?: InputMaybe<Scalars['String']['input']>;
  outputToken_not?: InputMaybe<Scalars['String']['input']>;
  outputToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  outputToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  outputToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  outputToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  outputToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  outputToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  outputToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  outputToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  outputToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  positions?: InputMaybe<Array<Scalars['String']['input']>>;
  positions_?: InputMaybe<Position_Filter>;
  positions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  positions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  positions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  positions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  positions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  pricePerShare?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pricePerShare_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  pricePerShare_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rebalanceCount?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalanceCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  rebalanceCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rebalances_?: InputMaybe<Rebalance_Filter>;
  rewardTokenEmissionsAmount?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmount_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsAmountsPerOutputToken_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsFinish_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardTokenEmissionsUSD?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokenEmissionsUSD_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokens?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_?: InputMaybe<RewardToken_Filter>;
  rewardTokens_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_not?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  rewardsManager_?: InputMaybe<RewardsManager_Filter>;
  stakedOutputTokenAmount?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakedOutputTokenAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  stakedOutputTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stakingRewardsManager?: InputMaybe<Scalars['Bytes']['input']>;
  stakingRewardsManager_contains?: InputMaybe<Scalars['Bytes']['input']>;
  stakingRewardsManager_gt?: InputMaybe<Scalars['Bytes']['input']>;
  stakingRewardsManager_gte?: InputMaybe<Scalars['Bytes']['input']>;
  stakingRewardsManager_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  stakingRewardsManager_lt?: InputMaybe<Scalars['Bytes']['input']>;
  stakingRewardsManager_lte?: InputMaybe<Scalars['Bytes']['input']>;
  stakingRewardsManager_not?: InputMaybe<Scalars['Bytes']['input']>;
  stakingRewardsManager_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  stakingRewardsManager_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tipRate?: InputMaybe<Scalars['BigInt']['input']>;
  tipRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tipRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tipRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tipRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tipRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tipRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  tipRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weeklyInterestRates_?: InputMaybe<WeeklyInterestRate_Filter>;
  weeklySnapshots_?: InputMaybe<VaultWeeklySnapshot_Filter>;
  withdrawableTotalAssets?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawableTotalAssetsUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  withdrawableTotalAssetsUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  withdrawableTotalAssetsUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  withdrawableTotalAssetsUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  withdrawableTotalAssetsUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  withdrawableTotalAssetsUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  withdrawableTotalAssetsUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  withdrawableTotalAssetsUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  withdrawableTotalAssets_gt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawableTotalAssets_gte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawableTotalAssets_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawableTotalAssets_lt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawableTotalAssets_lte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawableTotalAssets_not?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawableTotalAssets_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdraws_?: InputMaybe<Withdraw_Filter>;
};

export enum Vault_OrderBy {
  ActionSnapshots = 'actionSnapshots',
  Apr7d = 'apr7d',
  Apr30d = 'apr30d',
  Apr90d = 'apr90d',
  Apr180d = 'apr180d',
  Apr365d = 'apr365d',
  AprValues = 'aprValues',
  Arks = 'arks',
  ArksArray = 'arksArray',
  BufferArk = 'bufferArk',
  BufferArkCumulativeDeposits = 'bufferArk___cumulativeDeposits',
  BufferArkCumulativeWithdrawals = 'bufferArk___cumulativeWithdrawals',
  BufferArkLastUpdateInputTokenBalance = 'bufferArk___lastUpdateInputTokenBalance',
  BufferArkCalculatedApr = 'bufferArk__calculatedApr',
  BufferArkCreatedBlockNumber = 'bufferArk__createdBlockNumber',
  BufferArkCreatedTimestamp = 'bufferArk__createdTimestamp',
  BufferArkCumulativeEarnings = 'bufferArk__cumulativeEarnings',
  BufferArkCumulativeProtocolSideRevenueUsd = 'bufferArk__cumulativeProtocolSideRevenueUSD',
  BufferArkCumulativeSupplySideRevenueUsd = 'bufferArk__cumulativeSupplySideRevenueUSD',
  BufferArkCumulativeTotalRevenueUsd = 'bufferArk__cumulativeTotalRevenueUSD',
  BufferArkDepositCap = 'bufferArk__depositCap',
  BufferArkDepositLimit = 'bufferArk__depositLimit',
  BufferArkDetails = 'bufferArk__details',
  BufferArkId = 'bufferArk__id',
  BufferArkInputTokenBalance = 'bufferArk__inputTokenBalance',
  BufferArkLastUpdateTimestamp = 'bufferArk__lastUpdateTimestamp',
  BufferArkMaxDepositPercentageOfTvl = 'bufferArk__maxDepositPercentageOfTVL',
  BufferArkMaxRebalanceInflow = 'bufferArk__maxRebalanceInflow',
  BufferArkMaxRebalanceOutflow = 'bufferArk__maxRebalanceOutflow',
  BufferArkName = 'bufferArk__name',
  BufferArkProductId = 'bufferArk__productId',
  BufferArkRequiresKeeperData = 'bufferArk__requiresKeeperData',
  BufferArkTotalValueLockedUsd = 'bufferArk__totalValueLockedUSD',
  CalculatedApr = 'calculatedApr',
  CreatedBlockNumber = 'createdBlockNumber',
  CreatedTimestamp = 'createdTimestamp',
  CumulativeProtocolSideRevenueUsd = 'cumulativeProtocolSideRevenueUSD',
  CumulativeSupplySideRevenueUsd = 'cumulativeSupplySideRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  DailyInterestRates = 'dailyInterestRates',
  DailySnapshots = 'dailySnapshots',
  DepositCap = 'depositCap',
  DepositLimit = 'depositLimit',
  Deposits = 'deposits',
  Details = 'details',
  Fees = 'fees',
  HourlyInterestRates = 'hourlyInterestRates',
  HourlySnapshots = 'hourlySnapshots',
  Id = 'id',
  InputToken = 'inputToken',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenPriceUsd = 'inputTokenPriceUSD',
  InputTokenDecimals = 'inputToken__decimals',
  InputTokenId = 'inputToken__id',
  InputTokenLastPriceBlockNumber = 'inputToken__lastPriceBlockNumber',
  InputTokenLastPriceUsd = 'inputToken__lastPriceUSD',
  InputTokenName = 'inputToken__name',
  InputTokenSymbol = 'inputToken__symbol',
  LastUpdatePricePerShare = 'lastUpdatePricePerShare',
  LastUpdateTimestamp = 'lastUpdateTimestamp',
  MaxRebalanceOperations = 'maxRebalanceOperations',
  MinimumBufferBalance = 'minimumBufferBalance',
  Name = 'name',
  OutputToken = 'outputToken',
  OutputTokenPriceUsd = 'outputTokenPriceUSD',
  OutputTokenSupply = 'outputTokenSupply',
  OutputTokenDecimals = 'outputToken__decimals',
  OutputTokenId = 'outputToken__id',
  OutputTokenLastPriceBlockNumber = 'outputToken__lastPriceBlockNumber',
  OutputTokenLastPriceUsd = 'outputToken__lastPriceUSD',
  OutputTokenName = 'outputToken__name',
  OutputTokenSymbol = 'outputToken__symbol',
  Positions = 'positions',
  PricePerShare = 'pricePerShare',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  RebalanceCount = 'rebalanceCount',
  Rebalances = 'rebalances',
  RewardTokenEmissionsAmount = 'rewardTokenEmissionsAmount',
  RewardTokenEmissionsAmountsPerOutputToken = 'rewardTokenEmissionsAmountsPerOutputToken',
  RewardTokenEmissionsFinish = 'rewardTokenEmissionsFinish',
  RewardTokenEmissionsUsd = 'rewardTokenEmissionsUSD',
  RewardTokens = 'rewardTokens',
  RewardsManager = 'rewardsManager',
  RewardsManagerId = 'rewardsManager__id',
  StakedOutputTokenAmount = 'stakedOutputTokenAmount',
  StakingRewardsManager = 'stakingRewardsManager',
  Symbol = 'symbol',
  TipRate = 'tipRate',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  WeeklyInterestRates = 'weeklyInterestRates',
  WeeklySnapshots = 'weeklySnapshots',
  WithdrawableTotalAssets = 'withdrawableTotalAssets',
  WithdrawableTotalAssetsUsd = 'withdrawableTotalAssetsUSD',
  Withdraws = 'withdraws'
}

export type WeeklyInterestRate = {
  __typename?: 'WeeklyInterestRate';
  averageRate: Scalars['BigDecimal']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  sumRates: Scalars['BigDecimal']['output'];
  updateCount: Scalars['BigInt']['output'];
  vault: Vault;
};

export type WeeklyInterestRate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<WeeklyInterestRate_Filter>>>;
  averageRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  averageRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  averageRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  date?: InputMaybe<Scalars['BigInt']['input']>;
  date_gt?: InputMaybe<Scalars['BigInt']['input']>;
  date_gte?: InputMaybe<Scalars['BigInt']['input']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  date_lt?: InputMaybe<Scalars['BigInt']['input']>;
  date_lte?: InputMaybe<Scalars['BigInt']['input']>;
  date_not?: InputMaybe<Scalars['BigInt']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<WeeklyInterestRate_Filter>>>;
  sumRates?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sumRates_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  updateCount?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updateCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum WeeklyInterestRate_OrderBy {
  AverageRate = 'averageRate',
  Date = 'date',
  Id = 'id',
  SumRates = 'sumRates',
  UpdateCount = 'updateCount',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type Withdraw = Event & {
  __typename?: 'Withdraw';
  /**  Amount of token withdrawn in native units  */
  amount: Scalars['BigInt']['output'];
  /**  Amount of token withdrawn in USD  */
  amountUSD: Scalars['BigDecimal']['output'];
  /**  Token withdrawn  */
  asset: Token;
  /**  Block number of this event  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Market that tokens are withdrawn from  */
  from: Scalars['String']['output'];
  /**  Transaction hash of the transaction that emitted this event  */
  hash: Scalars['String']['output'];
  /**  { Transaction hash }-{ Log index } */
  id: Scalars['ID']['output'];
  /**  Amount of input token in the position  */
  inputTokenBalance: Scalars['BigInt']['output'];
  /**  Amount of input token in the position in USD  */
  inputTokenBalanceNormalizedUSD: Scalars['BigDecimal']['output'];
  /**  Event log index. For transactions that don't emit event, create arbitrary index starting from 0  */
  logIndex: Scalars['Int']['output'];
  /**  Position that this withdraw belongs to  */
  position: Position;
  /**  The protocol this transaction belongs to  */
  protocol: YieldAggregator;
  /**  Timestamp of this event  */
  timestamp: Scalars['BigInt']['output'];
  /**  Address that received tokens  */
  to: Scalars['String']['output'];
  /**  The vault involving this transaction  */
  vault: Vault;
};

export type Withdraw_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Withdraw_Filter>>>;
  asset?: InputMaybe<Scalars['String']['input']>;
  asset_?: InputMaybe<Token_Filter>;
  asset_contains?: InputMaybe<Scalars['String']['input']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_gt?: InputMaybe<Scalars['String']['input']>;
  asset_gte?: InputMaybe<Scalars['String']['input']>;
  asset_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_lt?: InputMaybe<Scalars['String']['input']>;
  asset_lte?: InputMaybe<Scalars['String']['input']>;
  asset_not?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains?: InputMaybe<Scalars['String']['input']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with?: InputMaybe<Scalars['String']['input']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  from?: InputMaybe<Scalars['String']['input']>;
  from_contains?: InputMaybe<Scalars['String']['input']>;
  from_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_gt?: InputMaybe<Scalars['String']['input']>;
  from_gte?: InputMaybe<Scalars['String']['input']>;
  from_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_lt?: InputMaybe<Scalars['String']['input']>;
  from_lte?: InputMaybe<Scalars['String']['input']>;
  from_not?: InputMaybe<Scalars['String']['input']>;
  from_not_contains?: InputMaybe<Scalars['String']['input']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  from_starts_with?: InputMaybe<Scalars['String']['input']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_contains?: InputMaybe<Scalars['String']['input']>;
  hash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains?: InputMaybe<Scalars['String']['input']>;
  hash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with?: InputMaybe<Scalars['String']['input']>;
  hash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  inputTokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalanceNormalizedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalanceNormalizedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  inputTokenBalanceNormalizedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  inputTokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  inputTokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  inputTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Withdraw_Filter>>>;
  position?: InputMaybe<Scalars['String']['input']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']['input']>;
  position_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_gt?: InputMaybe<Scalars['String']['input']>;
  position_gte?: InputMaybe<Scalars['String']['input']>;
  position_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_lt?: InputMaybe<Scalars['String']['input']>;
  position_lte?: InputMaybe<Scalars['String']['input']>;
  position_not?: InputMaybe<Scalars['String']['input']>;
  position_not_contains?: InputMaybe<Scalars['String']['input']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  position_starts_with?: InputMaybe<Scalars['String']['input']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  protocol_?: InputMaybe<YieldAggregator_Filter>;
  protocol_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_gt?: InputMaybe<Scalars['String']['input']>;
  protocol_gte?: InputMaybe<Scalars['String']['input']>;
  protocol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_lt?: InputMaybe<Scalars['String']['input']>;
  protocol_lte?: InputMaybe<Scalars['String']['input']>;
  protocol_not?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Vault_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Withdraw_OrderBy {
  Amount = 'amount',
  AmountUsd = 'amountUSD',
  Asset = 'asset',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetLastPriceBlockNumber = 'asset__lastPriceBlockNumber',
  AssetLastPriceUsd = 'asset__lastPriceUSD',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  BlockNumber = 'blockNumber',
  From = 'from',
  Hash = 'hash',
  Id = 'id',
  InputTokenBalance = 'inputTokenBalance',
  InputTokenBalanceNormalizedUsd = 'inputTokenBalanceNormalizedUSD',
  LogIndex = 'logIndex',
  Position = 'position',
  PositionClaimableSummerToken = 'position__claimableSummerToken',
  PositionClaimableSummerTokenNormalized = 'position__claimableSummerTokenNormalized',
  PositionClaimedSummerToken = 'position__claimedSummerToken',
  PositionClaimedSummerTokenNormalized = 'position__claimedSummerTokenNormalized',
  PositionCreatedBlockNumber = 'position__createdBlockNumber',
  PositionCreatedTimestamp = 'position__createdTimestamp',
  PositionId = 'position__id',
  PositionInputTokenBalance = 'position__inputTokenBalance',
  PositionInputTokenBalanceNormalized = 'position__inputTokenBalanceNormalized',
  PositionInputTokenBalanceNormalizedInUsd = 'position__inputTokenBalanceNormalizedInUSD',
  PositionInputTokenDeposits = 'position__inputTokenDeposits',
  PositionInputTokenDepositsNormalized = 'position__inputTokenDepositsNormalized',
  PositionInputTokenDepositsNormalizedInUsd = 'position__inputTokenDepositsNormalizedInUSD',
  PositionInputTokenWithdrawals = 'position__inputTokenWithdrawals',
  PositionInputTokenWithdrawalsNormalized = 'position__inputTokenWithdrawalsNormalized',
  PositionInputTokenWithdrawalsNormalizedInUsd = 'position__inputTokenWithdrawalsNormalizedInUSD',
  PositionOutputTokenBalance = 'position__outputTokenBalance',
  PositionStakedInputTokenBalance = 'position__stakedInputTokenBalance',
  PositionStakedInputTokenBalanceNormalized = 'position__stakedInputTokenBalanceNormalized',
  PositionStakedInputTokenBalanceNormalizedInUsd = 'position__stakedInputTokenBalanceNormalizedInUSD',
  PositionStakedOutputTokenBalance = 'position__stakedOutputTokenBalance',
  PositionUnstakedInputTokenBalance = 'position__unstakedInputTokenBalance',
  PositionUnstakedInputTokenBalanceNormalized = 'position__unstakedInputTokenBalanceNormalized',
  PositionUnstakedInputTokenBalanceNormalizedInUsd = 'position__unstakedInputTokenBalanceNormalizedInUSD',
  PositionUnstakedOutputTokenBalance = 'position__unstakedOutputTokenBalance',
  Protocol = 'protocol',
  ProtocolCumulativeProtocolSideRevenueUsd = 'protocol__cumulativeProtocolSideRevenueUSD',
  ProtocolCumulativeSupplySideRevenueUsd = 'protocol__cumulativeSupplySideRevenueUSD',
  ProtocolCumulativeTotalRevenueUsd = 'protocol__cumulativeTotalRevenueUSD',
  ProtocolCumulativeUniqueUsers = 'protocol__cumulativeUniqueUsers',
  ProtocolId = 'protocol__id',
  ProtocolLastDailyUpdateTimestamp = 'protocol__lastDailyUpdateTimestamp',
  ProtocolLastHourlyUpdateTimestamp = 'protocol__lastHourlyUpdateTimestamp',
  ProtocolLastWeeklyUpdateTimestamp = 'protocol__lastWeeklyUpdateTimestamp',
  ProtocolMethodologyVersion = 'protocol__methodologyVersion',
  ProtocolName = 'protocol__name',
  ProtocolNetwork = 'protocol__network',
  ProtocolProtocolControlledValueUsd = 'protocol__protocolControlledValueUSD',
  ProtocolSchemaVersion = 'protocol__schemaVersion',
  ProtocolSlug = 'protocol__slug',
  ProtocolSubgraphVersion = 'protocol__subgraphVersion',
  ProtocolTotalPoolCount = 'protocol__totalPoolCount',
  ProtocolTotalValueLockedUsd = 'protocol__totalValueLockedUSD',
  ProtocolType = 'protocol__type',
  Timestamp = 'timestamp',
  To = 'to',
  Vault = 'vault',
  VaultApr7d = 'vault__apr7d',
  VaultApr30d = 'vault__apr30d',
  VaultApr90d = 'vault__apr90d',
  VaultApr180d = 'vault__apr180d',
  VaultApr365d = 'vault__apr365d',
  VaultCalculatedApr = 'vault__calculatedApr',
  VaultCreatedBlockNumber = 'vault__createdBlockNumber',
  VaultCreatedTimestamp = 'vault__createdTimestamp',
  VaultCumulativeProtocolSideRevenueUsd = 'vault__cumulativeProtocolSideRevenueUSD',
  VaultCumulativeSupplySideRevenueUsd = 'vault__cumulativeSupplySideRevenueUSD',
  VaultCumulativeTotalRevenueUsd = 'vault__cumulativeTotalRevenueUSD',
  VaultDepositCap = 'vault__depositCap',
  VaultDepositLimit = 'vault__depositLimit',
  VaultDetails = 'vault__details',
  VaultId = 'vault__id',
  VaultInputTokenBalance = 'vault__inputTokenBalance',
  VaultInputTokenPriceUsd = 'vault__inputTokenPriceUSD',
  VaultLastUpdatePricePerShare = 'vault__lastUpdatePricePerShare',
  VaultLastUpdateTimestamp = 'vault__lastUpdateTimestamp',
  VaultMaxRebalanceOperations = 'vault__maxRebalanceOperations',
  VaultMinimumBufferBalance = 'vault__minimumBufferBalance',
  VaultName = 'vault__name',
  VaultOutputTokenPriceUsd = 'vault__outputTokenPriceUSD',
  VaultOutputTokenSupply = 'vault__outputTokenSupply',
  VaultPricePerShare = 'vault__pricePerShare',
  VaultRebalanceCount = 'vault__rebalanceCount',
  VaultStakedOutputTokenAmount = 'vault__stakedOutputTokenAmount',
  VaultStakingRewardsManager = 'vault__stakingRewardsManager',
  VaultSymbol = 'vault__symbol',
  VaultTipRate = 'vault__tipRate',
  VaultTotalValueLockedUsd = 'vault__totalValueLockedUSD',
  VaultWithdrawableTotalAssets = 'vault__withdrawableTotalAssets',
  VaultWithdrawableTotalAssetsUsd = 'vault__withdrawableTotalAssetsUSD'
}

export type YieldAggregator = Protocol & {
  __typename?: 'YieldAggregator';
  /**  Gross revenue for the protocol (revenue claimed by protocol). Examples: AMM protocol fee (Sushi’s 0.05%). OpenSea 10% sell fee.  */
  cumulativeProtocolSideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Revenue claimed by suppliers to the protocol. LPs on DEXs (e.g. 0.25% of the swap fee in Sushiswap). Depositors on Lending Protocols. NFT sellers on OpenSea.  */
  cumulativeSupplySideRevenueUSD: Scalars['BigDecimal']['output'];
  /**  All revenue generated by the protocol. e.g. 0.30% of swap fee in Sushiswap, all yield generated by Yearn.  */
  cumulativeTotalRevenueUSD: Scalars['BigDecimal']['output'];
  /**  Number of cumulative unique users  */
  cumulativeUniqueUsers: Scalars['Int']['output'];
  /**  Daily usage metrics for this protocol  */
  dailyUsageMetrics: Array<UsageMetricsDailySnapshot>;
  /**  Daily financial metrics for this protocol  */
  financialMetrics: Array<FinancialsDailySnapshot>;
  /**  Hourly usage metrics for this protocol  */
  hourlyUsageMetrics: Array<UsageMetricsHourlySnapshot>;
  /**  Smart contract address of the protocol's main contract (Factory, Registry, etc)  */
  id: Scalars['ID']['output'];
  lastDailyUpdateTimestamp?: Maybe<Scalars['BigInt']['output']>;
  lastHourlyUpdateTimestamp?: Maybe<Scalars['BigInt']['output']>;
  lastWeeklyUpdateTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /**  Version of the methodology used to compute metrics, loosely based on SemVer format (e.g. 1.0.0)  */
  methodologyVersion: Scalars['String']['output'];
  /**  Name of the protocol, including version. e.g. Yearn v3  */
  name: Scalars['String']['output'];
  /**  The blockchain network this subgraph is indexing on  */
  network: Network;
  /**  Current PCV (Protocol Controlled Value). Only relevant for protocols with PCV.  */
  protocolControlledValueUSD?: Maybe<Scalars['BigDecimal']['output']>;
  /**  Version of the subgraph schema, in SemVer format (e.g. 1.0.0)  */
  schemaVersion: Scalars['String']['output'];
  /**  Slug of protocol, including version. e.g. yearn-v3  */
  slug: Scalars['String']['output'];
  /**  Version of the subgraph implementation, in SemVer format (e.g. 1.0.0)  */
  subgraphVersion: Scalars['String']['output'];
  /**  Total number of pools  */
  totalPoolCount: Scalars['Int']['output'];
  /**  Current TVL (Total Value Locked) of the entire protocol  */
  totalValueLockedUSD: Scalars['BigDecimal']['output'];
  /**  The type of protocol (e.g. DEX, Lending, Yield, etc)  */
  type: ProtocolType;
  /**  All vaults that belong to this protocol  */
  vaults: Array<Vault>;
  vaultsArray: Array<Vault>;
};


export type YieldAggregatorDailyUsageMetricsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsageMetricsDailySnapshot_Filter>;
};


export type YieldAggregatorFinancialMetricsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FinancialsDailySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FinancialsDailySnapshot_Filter>;
};


export type YieldAggregatorHourlyUsageMetricsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UsageMetricsHourlySnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsageMetricsHourlySnapshot_Filter>;
};


export type YieldAggregatorVaultsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Vault_Filter>;
};


export type YieldAggregatorVaultsArrayArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Vault_Filter>;
};

export type YieldAggregator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<YieldAggregator_Filter>>>;
  cumulativeProtocolSideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeProtocolSideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeProtocolSideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeSupplySideRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeSupplySideRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeTotalRevenueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cumulativeTotalRevenueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cumulativeUniqueUsers?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_gte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cumulativeUniqueUsers_lt?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_lte?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not?: InputMaybe<Scalars['Int']['input']>;
  cumulativeUniqueUsers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dailyUsageMetrics_?: InputMaybe<UsageMetricsDailySnapshot_Filter>;
  financialMetrics_?: InputMaybe<FinancialsDailySnapshot_Filter>;
  hourlyUsageMetrics_?: InputMaybe<UsageMetricsHourlySnapshot_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastDailyUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailyUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailyUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailyUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastDailyUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailyUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailyUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastDailyUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastHourlyUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastHourlyUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastHourlyUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastHourlyUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastHourlyUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastHourlyUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastHourlyUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastHourlyUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastWeeklyUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastWeeklyUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastWeeklyUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastWeeklyUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastWeeklyUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastWeeklyUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastWeeklyUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastWeeklyUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  methodologyVersion?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_gte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_lt?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_lte?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  methodologyVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  methodologyVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  network?: InputMaybe<Network>;
  network_in?: InputMaybe<Array<Network>>;
  network_not?: InputMaybe<Network>;
  network_not_in?: InputMaybe<Array<Network>>;
  or?: InputMaybe<Array<InputMaybe<YieldAggregator_Filter>>>;
  protocolControlledValueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolControlledValueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolControlledValueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  schemaVersion?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_gte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_lt?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_lte?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_gt?: InputMaybe<Scalars['String']['input']>;
  slug_gte?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_lt?: InputMaybe<Scalars['String']['input']>;
  slug_lte?: InputMaybe<Scalars['String']['input']>;
  slug_not?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_gte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_lt?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_lte?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  subgraphVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  subgraphVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalPoolCount?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_gte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalPoolCount_lt?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_lte?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_not?: InputMaybe<Scalars['Int']['input']>;
  totalPoolCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalValueLockedUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalValueLockedUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalValueLockedUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  type?: InputMaybe<ProtocolType>;
  type_in?: InputMaybe<Array<ProtocolType>>;
  type_not?: InputMaybe<ProtocolType>;
  type_not_in?: InputMaybe<Array<ProtocolType>>;
  vaultsArray?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultsArray_?: InputMaybe<Vault_Filter>;
  vaultsArray_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultsArray_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultsArray_not?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultsArray_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultsArray_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  vaults_?: InputMaybe<Vault_Filter>;
};

export enum YieldAggregator_OrderBy {
  CumulativeProtocolSideRevenueUsd = 'cumulativeProtocolSideRevenueUSD',
  CumulativeSupplySideRevenueUsd = 'cumulativeSupplySideRevenueUSD',
  CumulativeTotalRevenueUsd = 'cumulativeTotalRevenueUSD',
  CumulativeUniqueUsers = 'cumulativeUniqueUsers',
  DailyUsageMetrics = 'dailyUsageMetrics',
  FinancialMetrics = 'financialMetrics',
  HourlyUsageMetrics = 'hourlyUsageMetrics',
  Id = 'id',
  LastDailyUpdateTimestamp = 'lastDailyUpdateTimestamp',
  LastHourlyUpdateTimestamp = 'lastHourlyUpdateTimestamp',
  LastWeeklyUpdateTimestamp = 'lastWeeklyUpdateTimestamp',
  MethodologyVersion = 'methodologyVersion',
  Name = 'name',
  Network = 'network',
  ProtocolControlledValueUsd = 'protocolControlledValueUSD',
  SchemaVersion = 'schemaVersion',
  Slug = 'slug',
  SubgraphVersion = 'subgraphVersion',
  TotalPoolCount = 'totalPoolCount',
  TotalValueLockedUsd = 'totalValueLockedUSD',
  Type = 'type',
  Vaults = 'vaults',
  VaultsArray = 'vaultsArray'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetGlobalRebalancesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalRebalancesQuery = { __typename?: 'Query', rebalances: Array<{ __typename?: 'Rebalance', id: string, amount: bigint, amountUSD: string, timestamp: bigint, asset: { __typename?: 'Token', id: string, symbol: string, decimals: number }, from: { __typename?: 'Ark', name?: string | null, depositLimit: bigint, calculatedApr: string, totalValueLockedUSD: string }, to: { __typename?: 'Ark', name?: string | null, depositLimit: bigint, calculatedApr: string, totalValueLockedUSD: string }, toPostAction: { __typename?: 'PostActionArkSnapshot', totalValueLockedUSD: string, depositLimit: bigint }, fromPostAction: { __typename?: 'PostActionArkSnapshot', totalValueLockedUSD: string, depositLimit: bigint }, protocol: { __typename?: 'YieldAggregator', name: string, network: Network }, vault: { __typename?: 'Vault', outputTokenPriceUSD?: string | null, inputTokenPriceUSD?: string | null, id: string, name?: string | null, inputToken: { __typename?: 'Token', id: string, symbol: string }, protocol: { __typename?: 'YieldAggregator', network: Network } } }> };

export type GetLatestActivityQueryVariables = Exact<{
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
}>;


export type GetLatestActivityQuery = { __typename?: 'Query', deposits: Array<{ __typename?: 'Deposit', hash: string, timestamp: bigint, amount: bigint, amountUSD: string, position: { __typename?: 'Position', inputTokenBalance: bigint, inputTokenBalanceNormalized: string, inputTokenBalanceNormalizedInUSD: string, account: { __typename?: 'Account', id: string }, vault: { __typename?: 'Vault', id: string, name?: string | null, inputTokenPriceUSD?: string | null, inputToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, protocol: { __typename?: 'YieldAggregator', network: Network } } } }>, withdraws: Array<{ __typename?: 'Withdraw', hash: string, timestamp: bigint, amount: bigint, amountUSD: string, position: { __typename?: 'Position', inputTokenBalance: bigint, inputTokenBalanceNormalized: string, inputTokenBalanceNormalizedInUSD: string, account: { __typename?: 'Account', id: string }, vault: { __typename?: 'Vault', id: string, name?: string | null, inputTokenPriceUSD?: string | null, inputToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, protocol: { __typename?: 'YieldAggregator', network: Network } } } }> };

export type GetUserPositionsQueryVariables = Exact<{
  accountAddress: Scalars['String']['input'];
}>;


export type GetUserPositionsQuery = { __typename?: 'Query', positions: Array<{ __typename?: 'Position', id: string, inputTokenBalance: bigint, outputTokenBalance: bigint, stakedInputTokenBalance: bigint, stakedOutputTokenBalance: bigint, createdTimestamp: bigint, claimedSummerTokenNormalized: string, claimableSummerTokenNormalized: string, deposits: Array<{ __typename?: 'Deposit', amount: bigint, amountUSD: string, inputTokenBalance: bigint }>, withdrawals: Array<{ __typename?: 'Withdraw', amount: bigint, amountUSD: string, inputTokenBalance: bigint }>, vault: { __typename?: 'Vault', id: string, inputTokenBalance: bigint, inputTokenPriceUSD?: string | null, outputTokenPriceUSD?: string | null, rebalanceCount: bigint, inputToken: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: number }, outputToken?: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: number } | null, protocol: { __typename?: 'YieldAggregator', id: string } }, account: { __typename?: 'Account', id: string }, rewards: Array<{ __typename?: 'PositionRewards', claimedNormalized: string, claimableNormalized: string, rewardToken: { __typename?: 'Token', symbol: string, lastPriceUSD?: string | null } }> }> };

export type GetUserPositionQueryVariables = Exact<{
  accountAddress: Scalars['String']['input'];
  vaultId: Scalars['String']['input'];
}>;


export type GetUserPositionQuery = { __typename?: 'Query', positions: Array<{ __typename?: 'Position', id: string, inputTokenBalance: bigint, outputTokenBalance: bigint, stakedInputTokenBalance: bigint, stakedOutputTokenBalance: bigint, createdTimestamp: bigint, claimedSummerTokenNormalized: string, claimableSummerTokenNormalized: string, deposits: Array<{ __typename?: 'Deposit', amount: bigint, amountUSD: string, inputTokenBalance: bigint }>, withdrawals: Array<{ __typename?: 'Withdraw', amount: bigint, amountUSD: string, inputTokenBalance: bigint }>, vault: { __typename?: 'Vault', id: string, inputTokenBalance: bigint, inputTokenPriceUSD?: string | null, outputTokenPriceUSD?: string | null, inputToken: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: number }, outputToken?: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: number } | null, protocol: { __typename?: 'YieldAggregator', id: string } }, account: { __typename?: 'Account', id: string }, rewards: Array<{ __typename?: 'PositionRewards', claimedNormalized: string, claimableNormalized: string, rewardToken: { __typename?: 'Token', symbol: string, lastPriceUSD?: string | null } }> }> };

export type GetPositionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPositionQuery = { __typename?: 'Query', positions: Array<{ __typename?: 'Position', id: string, inputTokenBalance: bigint, outputTokenBalance: bigint, stakedInputTokenBalance: bigint, stakedOutputTokenBalance: bigint, createdTimestamp: bigint, claimedSummerTokenNormalized: string, claimableSummerTokenNormalized: string, deposits: Array<{ __typename?: 'Deposit', amount: bigint, amountUSD: string, inputTokenBalance: bigint }>, withdrawals: Array<{ __typename?: 'Withdraw', amount: bigint, amountUSD: string, inputTokenBalance: bigint }>, vault: { __typename?: 'Vault', id: string, inputTokenBalance: bigint, inputTokenPriceUSD?: string | null, outputTokenPriceUSD?: string | null, inputToken: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: number }, outputToken?: { __typename?: 'Token', id: string, symbol: string, name: string, decimals: number } | null, protocol: { __typename?: 'YieldAggregator', id: string } }, account: { __typename?: 'Account', id: string }, rewards: Array<{ __typename?: 'PositionRewards', claimedNormalized: string, claimableNormalized: string, rewardToken: { __typename?: 'Token', symbol: string, lastPriceUSD?: string | null } }> }> };

export type GetRebalancesQueryVariables = Exact<{
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
}>;


export type GetRebalancesQuery = { __typename?: 'Query', rebalances: Array<{ __typename?: 'Rebalance', id: string, amount: bigint, amountUSD: string, timestamp: bigint, hash: string, from: { __typename?: 'Ark', name?: string | null, depositLimit: bigint, totalValueLockedUSD: string }, to: { __typename?: 'Ark', name?: string | null, depositLimit: bigint, totalValueLockedUSD: string }, fromPostAction: { __typename?: 'PostActionArkSnapshot', depositLimit: bigint }, toPostAction: { __typename?: 'PostActionArkSnapshot', depositLimit: bigint }, vault: { __typename?: 'Vault', id: string, name?: string | null, inputTokenPriceUSD?: string | null, inputToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, protocol: { __typename?: 'YieldAggregator', network: Network } } }> };

export type GetTopDepositorsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
}>;


export type GetTopDepositorsQuery = { __typename?: 'Query', positions: Array<{ __typename?: 'Position', inputTokenBalance: bigint, inputTokenBalanceNormalized: string, inputTokenBalanceNormalizedInUSD: string, account: { __typename?: 'Account', id: string }, deposits: Array<{ __typename?: 'Deposit', timestamp: bigint, amount: bigint }>, withdrawals: Array<{ __typename?: 'Withdraw', timestamp: bigint, amount: bigint }>, vault: { __typename?: 'Vault', name?: string | null, id: string, rebalanceCount: bigint, inputTokenPriceUSD?: string | null, inputToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, protocol: { __typename?: 'YieldAggregator', network: Network } } }> };

export type GetUserActivityQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  accountId: Scalars['ID']['input'];
}>;


export type GetUserActivityQuery = { __typename?: 'Query', positions: Array<{ __typename?: 'Position', inputTokenBalance: bigint, outputTokenBalance: bigint, account: { __typename?: 'Account', id: string }, deposits: Array<{ __typename?: 'Deposit', timestamp: bigint, amount: bigint, hash: string, inputTokenBalance: bigint }>, withdrawals: Array<{ __typename?: 'Withdraw', timestamp: bigint, amount: bigint, hash: string, inputTokenBalance: bigint }>, vault: { __typename?: 'Vault', id: string, name?: string | null, inputTokenBalance: bigint, inputTokenPriceUSD?: string | null, outputTokenPriceUSD?: string | null, apr365d: string, inputToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, protocol: { __typename?: 'YieldAggregator', network: Network } } }> };

export type GetUsersActivityQueryVariables = Exact<{
  where?: InputMaybe<Position_Filter>;
}>;


export type GetUsersActivityQuery = { __typename?: 'Query', positions: Array<{ __typename?: 'Position', inputTokenBalance: bigint, account: { __typename?: 'Account', id: string }, deposits: Array<{ __typename?: 'Deposit', timestamp: bigint, amount: bigint, hash: string, inputTokenBalance: bigint }>, withdrawals: Array<{ __typename?: 'Withdraw', timestamp: bigint, amount: bigint, hash: string, inputTokenBalance: bigint }>, vault: { __typename?: 'Vault', id: string, name?: string | null, outputTokenPriceUSD?: string | null, inputTokenPriceUSD?: string | null, apr365d: string, inputToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, protocol: { __typename?: 'YieldAggregator', network: Network } } }> };

export type GetVaultsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVaultsQuery = { __typename?: 'Query', vaults: Array<{ __typename?: 'Vault', id: string, name?: string | null, rewardTokenEmissionsAmount: Array<bigint>, rewardTokenEmissionsUSD?: Array<string> | null, rebalanceCount: bigint, inputTokenBalance: bigint, inputTokenPriceUSD?: string | null, outputTokenPriceUSD?: string | null, depositLimit: bigint, createdTimestamp: bigint, totalValueLockedUSD: string, cumulativeTotalRevenueUSD: string, cumulativeSupplySideRevenueUSD: string, cumulativeProtocolSideRevenueUSD: string, lastUpdateTimestamp: bigint, apr7d: string, apr30d: string, apr90d: string, apr180d: string, apr365d: string, calculatedApr: string, aprValues: Array<string>, withdrawableTotalAssets?: bigint | null, withdrawableTotalAssetsUSD?: string | null, protocol: { __typename?: 'YieldAggregator', network: Network }, rewardsManager: { __typename?: 'RewardsManager', id: string }, rewardTokens: Array<{ __typename?: 'RewardToken', id: string, token: { __typename?: 'Token', id: string, symbol: string, decimals: number } }>, arks: Array<{ __typename?: 'Ark', id: string, name?: string | null, details?: string | null, depositLimit: bigint, depositCap: bigint, inputTokenBalance: bigint, createdTimestamp: bigint, lastUpdateTimestamp: bigint, inputToken: { __typename?: 'Token', id: string, name: string, symbol: string, decimals: number } }>, inputToken: { __typename?: 'Token', id: string, name: string, symbol: string, decimals: number }, outputToken?: { __typename?: 'Token', id: string, name: string, symbol: string, decimals: number } | null, dailyInterestRates: Array<{ __typename?: 'DailyInterestRate', averageRate: string, date: bigint }>, hourlyInterestRates: Array<{ __typename?: 'HourlyInterestRate', averageRate: string, date: bigint }>, weeklyInterestRates: Array<{ __typename?: 'WeeklyInterestRate', averageRate: string, date: bigint }> }> };

export type GetVaultQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetVaultQuery = { __typename?: 'Query', vault?: { __typename?: 'Vault', id: string, name?: string | null, rewardTokenEmissionsUSD?: Array<string> | null, rewardTokenEmissionsAmount: Array<bigint>, rebalanceCount: bigint, inputTokenBalance: bigint, inputTokenPriceUSD?: string | null, outputTokenPriceUSD?: string | null, depositLimit: bigint, createdTimestamp: bigint, totalValueLockedUSD: string, cumulativeTotalRevenueUSD: string, cumulativeSupplySideRevenueUSD: string, cumulativeProtocolSideRevenueUSD: string, lastUpdateTimestamp: bigint, apr7d: string, apr30d: string, apr90d: string, apr180d: string, apr365d: string, calculatedApr: string, aprValues: Array<string>, withdrawableTotalAssets?: bigint | null, withdrawableTotalAssetsUSD?: string | null, protocol: { __typename?: 'YieldAggregator', network: Network }, rewardsManager: { __typename?: 'RewardsManager', id: string }, rewardTokens: Array<{ __typename?: 'RewardToken', id: string, token: { __typename?: 'Token', id: string, symbol: string, decimals: number } }>, rebalances: Array<{ __typename?: 'Rebalance', id: string, amount: bigint, amountUSD: string, timestamp: bigint, asset: { __typename?: 'Token', id: string, symbol: string, decimals: number }, from: { __typename?: 'Ark', name?: string | null, depositLimit: bigint, calculatedApr: string, totalValueLockedUSD: string }, to: { __typename?: 'Ark', name?: string | null, depositLimit: bigint, calculatedApr: string, totalValueLockedUSD: string }, toPostAction: { __typename?: 'PostActionArkSnapshot', totalValueLockedUSD: string, depositLimit: bigint }, fromPostAction: { __typename?: 'PostActionArkSnapshot', totalValueLockedUSD: string, depositLimit: bigint }, protocol: { __typename?: 'YieldAggregator', name: string, network: Network }, vault: { __typename?: 'Vault', id: string, name?: string | null, inputToken: { __typename?: 'Token', id: string, symbol: string } } }>, arks: Array<{ __typename?: 'Ark', id: string, name?: string | null, details?: string | null, depositLimit: bigint, depositCap: bigint, cumulativeEarnings: bigint, inputTokenBalance: bigint, calculatedApr: string, createdTimestamp: bigint, lastUpdateTimestamp: bigint, inputToken: { __typename?: 'Token', id: string, name: string, symbol: string, decimals: number }, dailySnapshots: Array<{ __typename?: 'ArkDailySnapshot', id: string, apr: string, totalValueLockedUSD: string, inputTokenBalance: bigint }>, hourlySnapshots: Array<{ __typename?: 'ArkHourlySnapshot', id: string, calculatedApr: string, totalValueLockedUSD: string, inputTokenBalance: bigint }> }>, inputToken: { __typename?: 'Token', id: string, name: string, symbol: string, decimals: number }, outputToken?: { __typename?: 'Token', id: string, name: string, symbol: string, decimals: number } | null, dailyInterestRates: Array<{ __typename?: 'DailyInterestRate', averageRate: string, date: bigint }>, hourlyInterestRates: Array<{ __typename?: 'HourlyInterestRate', averageRate: string, date: bigint }>, weeklyInterestRates: Array<{ __typename?: 'WeeklyInterestRate', averageRate: string, date: bigint }> } | null };


export const GetGlobalRebalancesDocument = gql`
    query GetGlobalRebalances {
  rebalances(orderBy: timestamp, orderDirection: desc) {
    id
    amount
    amountUSD
    asset {
      id
      symbol
      decimals
    }
    from {
      name
      depositLimit
      calculatedApr
      totalValueLockedUSD
    }
    to {
      name
      depositLimit
      calculatedApr
      totalValueLockedUSD
    }
    toPostAction {
      totalValueLockedUSD
      depositLimit
    }
    fromPostAction {
      totalValueLockedUSD
      depositLimit
    }
    protocol {
      name
      network
    }
    timestamp
    vault {
      outputTokenPriceUSD
      inputTokenPriceUSD
      id
      name
      inputToken {
        id
        symbol
      }
      protocol {
        network
      }
    }
  }
}
    `;
export const GetLatestActivityDocument = gql`
    query GetLatestActivity($timestamp: BigInt, $first: Int!, $skip: Int!) {
  deposits(
    where: {timestamp_gt: $timestamp}
    first: $first
    skip: $skip
    orderBy: timestamp
    orderDirection: desc
  ) {
    hash
    timestamp
    amount
    amountUSD
    position {
      account {
        id
      }
      inputTokenBalance
      inputTokenBalanceNormalized
      inputTokenBalanceNormalizedInUSD
      vault {
        id
        name
        inputToken {
          id
          symbol
          decimals
        }
        inputTokenPriceUSD
        protocol {
          network
        }
      }
    }
  }
  withdraws(
    where: {timestamp_gt: $timestamp}
    first: $first
    skip: $skip
    orderBy: timestamp
    orderDirection: desc
  ) {
    hash
    timestamp
    amount
    amountUSD
    position {
      account {
        id
      }
      inputTokenBalance
      inputTokenBalanceNormalized
      inputTokenBalanceNormalizedInUSD
      vault {
        id
        name
        inputToken {
          id
          symbol
          decimals
        }
        inputTokenPriceUSD
        protocol {
          network
        }
      }
    }
  }
}
    `;
export const GetUserPositionsDocument = gql`
    query GetUserPositions($accountAddress: String!) {
  positions(where: {account_contains_nocase: $accountAddress}) {
    id
    inputTokenBalance
    outputTokenBalance
    stakedInputTokenBalance
    stakedOutputTokenBalance
    createdTimestamp
    deposits {
      amount
      amountUSD
      inputTokenBalance
    }
    withdrawals {
      amount
      amountUSD
      inputTokenBalance
    }
    vault {
      id
      inputTokenBalance
      inputTokenPriceUSD
      outputTokenPriceUSD
      rebalanceCount
      inputToken {
        id
        symbol
        name
        decimals
      }
      outputToken {
        id
        symbol
        name
        decimals
      }
      protocol {
        id
      }
    }
    account {
      id
    }
    claimedSummerTokenNormalized
    claimableSummerTokenNormalized
    rewards {
      claimedNormalized
      claimableNormalized
      rewardToken {
        symbol
        lastPriceUSD
      }
    }
  }
}
    `;
export const GetUserPositionDocument = gql`
    query GetUserPosition($accountAddress: String!, $vaultId: String!) {
  positions(where: {account_contains_nocase: $accountAddress, vault: $vaultId}) {
    id
    inputTokenBalance
    outputTokenBalance
    stakedInputTokenBalance
    stakedOutputTokenBalance
    createdTimestamp
    deposits {
      amount
      amountUSD
      inputTokenBalance
    }
    withdrawals {
      amount
      amountUSD
      inputTokenBalance
    }
    vault {
      id
      inputTokenBalance
      inputTokenPriceUSD
      outputTokenPriceUSD
      inputToken {
        id
        symbol
        name
        decimals
      }
      outputToken {
        id
        symbol
        name
        decimals
      }
      protocol {
        id
      }
    }
    account {
      id
    }
    claimedSummerTokenNormalized
    claimableSummerTokenNormalized
    rewards {
      claimedNormalized
      claimableNormalized
      rewardToken {
        symbol
        lastPriceUSD
      }
    }
  }
}
    `;
export const GetPositionDocument = gql`
    query GetPosition($id: ID!) {
  positions(where: {id: $id}) {
    id
    inputTokenBalance
    outputTokenBalance
    stakedInputTokenBalance
    stakedOutputTokenBalance
    createdTimestamp
    deposits {
      amount
      amountUSD
      inputTokenBalance
    }
    withdrawals {
      amount
      amountUSD
      inputTokenBalance
    }
    vault {
      id
      inputTokenBalance
      inputTokenPriceUSD
      outputTokenPriceUSD
      inputToken {
        id
        symbol
        name
        decimals
      }
      outputToken {
        id
        symbol
        name
        decimals
      }
      protocol {
        id
      }
    }
    account {
      id
    }
    claimedSummerTokenNormalized
    claimableSummerTokenNormalized
    rewards {
      claimedNormalized
      claimableNormalized
      rewardToken {
        symbol
        lastPriceUSD
      }
    }
  }
}
    `;
export const GetRebalancesDocument = gql`
    query GetRebalances($timestamp: BigInt, $first: Int!, $skip: Int!) {
  rebalances(
    where: {timestamp_gt: $timestamp}
    first: $first
    skip: $skip
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    amount
    amountUSD
    from {
      name
      depositLimit
      totalValueLockedUSD
    }
    to {
      name
      depositLimit
      totalValueLockedUSD
    }
    fromPostAction {
      depositLimit
    }
    toPostAction {
      depositLimit
    }
    timestamp
    vault {
      id
      name
      inputToken {
        id
        symbol
        decimals
      }
      inputTokenPriceUSD
      protocol {
        network
      }
    }
    hash
  }
}
    `;
export const GetTopDepositorsDocument = gql`
    query GetTopDepositors($first: Int!, $skip: Int!) {
  positions(
    first: $first
    skip: $skip
    orderBy: createdTimestamp
    orderDirection: desc
    where: {inputTokenBalance_gt: "0"}
  ) {
    account {
      id
    }
    inputTokenBalance
    inputTokenBalanceNormalized
    inputTokenBalanceNormalizedInUSD
    deposits {
      timestamp
      amount
    }
    withdrawals {
      timestamp
      amount
    }
    vault {
      name
      id
      rebalanceCount
      inputToken {
        id
        symbol
        decimals
      }
      inputTokenPriceUSD
      protocol {
        network
      }
    }
  }
}
    `;
export const GetUserActivityDocument = gql`
    query GetUserActivity($id: ID!, $accountId: ID!) {
  positions(where: {vault_: {id: $id}, account_: {id: $accountId}}, first: 1000) {
    account {
      id
    }
    inputTokenBalance
    outputTokenBalance
    deposits {
      timestamp
      amount
      hash
      inputTokenBalance
    }
    withdrawals {
      timestamp
      amount
      hash
      inputTokenBalance
    }
    vault {
      id
      name
      inputTokenBalance
      inputTokenPriceUSD
      outputTokenPriceUSD
      inputToken {
        id
        symbol
        decimals
      }
      protocol {
        network
      }
      apr365d
    }
  }
}
    `;
export const GetUsersActivityDocument = gql`
    query GetUsersActivity($where: Position_filter) {
  positions(where: $where, first: 1000) {
    account {
      id
    }
    inputTokenBalance
    deposits {
      timestamp
      amount
      hash
      inputTokenBalance
    }
    withdrawals {
      timestamp
      amount
      hash
      inputTokenBalance
    }
    vault {
      id
      name
      outputTokenPriceUSD
      inputTokenPriceUSD
      inputToken {
        id
        symbol
        decimals
      }
      protocol {
        network
      }
      apr365d
    }
  }
}
    `;
export const GetVaultsDocument = gql`
    query GetVaults {
  vaults {
    protocol {
      network
    }
    id
    name
    rewardsManager {
      id
    }
    rewardTokens {
      id
      token {
        id
        symbol
        decimals
      }
    }
    rewardTokenEmissionsAmount
    rewardTokenEmissionsUSD
    rebalanceCount
    arks {
      id
      name
      details
      depositLimit
      depositCap
      inputTokenBalance
      inputToken {
        id
        name
        symbol
        decimals
      }
      createdTimestamp
      lastUpdateTimestamp
    }
    inputToken {
      id
      name
      symbol
      decimals
    }
    outputToken {
      id
      name
      symbol
      decimals
    }
    inputTokenBalance
    inputTokenPriceUSD
    outputTokenPriceUSD
    depositLimit
    createdTimestamp
    totalValueLockedUSD
    cumulativeTotalRevenueUSD
    cumulativeSupplySideRevenueUSD
    cumulativeProtocolSideRevenueUSD
    lastUpdateTimestamp
    apr7d
    apr30d
    apr90d
    apr180d
    apr365d
    calculatedApr
    aprValues
    withdrawableTotalAssets
    withdrawableTotalAssetsUSD
    dailyInterestRates(first: 365, orderBy: date, orderDirection: desc) {
      averageRate
      date
    }
    hourlyInterestRates(first: 720, orderBy: date, orderDirection: desc) {
      averageRate
      date
    }
    weeklyInterestRates(first: 156, orderBy: date, orderDirection: desc) {
      averageRate
      date
    }
  }
}
    `;
export const GetVaultDocument = gql`
    query GetVault($id: ID!) {
  vault(id: $id) {
    protocol {
      network
    }
    rewardsManager {
      id
    }
    id
    name
    rewardTokens {
      id
      token {
        id
        symbol
        decimals
      }
    }
    rewardTokenEmissionsUSD
    rewardTokenEmissionsAmount
    rebalanceCount
    rebalances(orderBy: timestamp, orderDirection: desc) {
      id
      amount
      amountUSD
      asset {
        id
        symbol
        decimals
      }
      from {
        name
        depositLimit
        calculatedApr
        totalValueLockedUSD
      }
      to {
        name
        depositLimit
        calculatedApr
        totalValueLockedUSD
      }
      toPostAction {
        totalValueLockedUSD
        depositLimit
      }
      fromPostAction {
        totalValueLockedUSD
        depositLimit
      }
      protocol {
        name
        network
      }
      timestamp
      vault {
        id
        name
        inputToken {
          id
          symbol
        }
      }
    }
    arks {
      id
      name
      details
      depositLimit
      depositCap
      cumulativeEarnings
      inputTokenBalance
      inputToken {
        id
        name
        symbol
        decimals
      }
      dailySnapshots(first: 10) {
        id
        apr
        totalValueLockedUSD
        inputTokenBalance
      }
      hourlySnapshots(first: 10) {
        id
        calculatedApr
        totalValueLockedUSD
        inputTokenBalance
      }
      calculatedApr
      createdTimestamp
      lastUpdateTimestamp
    }
    inputToken {
      id
      name
      symbol
      decimals
    }
    outputToken {
      id
      name
      symbol
      decimals
    }
    inputTokenBalance
    inputTokenPriceUSD
    outputTokenPriceUSD
    depositLimit
    createdTimestamp
    totalValueLockedUSD
    cumulativeTotalRevenueUSD
    cumulativeSupplySideRevenueUSD
    cumulativeProtocolSideRevenueUSD
    lastUpdateTimestamp
    apr7d
    apr30d
    apr90d
    apr180d
    apr365d
    calculatedApr
    aprValues
    withdrawableTotalAssets
    withdrawableTotalAssetsUSD
    dailyInterestRates(first: 365, orderBy: date, orderDirection: desc) {
      averageRate
      date
    }
    hourlyInterestRates(first: 720, orderBy: date, orderDirection: desc) {
      averageRate
      date
    }
    weeklyInterestRates(first: 156, orderBy: date, orderDirection: desc) {
      averageRate
      date
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetGlobalRebalances(variables?: GetGlobalRebalancesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetGlobalRebalancesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGlobalRebalancesQuery>(GetGlobalRebalancesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetGlobalRebalances', 'query', variables);
    },
    GetLatestActivity(variables: GetLatestActivityQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetLatestActivityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLatestActivityQuery>(GetLatestActivityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetLatestActivity', 'query', variables);
    },
    GetUserPositions(variables: GetUserPositionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUserPositionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserPositionsQuery>(GetUserPositionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetUserPositions', 'query', variables);
    },
    GetUserPosition(variables: GetUserPositionQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUserPositionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserPositionQuery>(GetUserPositionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetUserPosition', 'query', variables);
    },
    GetPosition(variables: GetPositionQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetPositionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPositionQuery>(GetPositionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetPosition', 'query', variables);
    },
    GetRebalances(variables: GetRebalancesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetRebalancesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRebalancesQuery>(GetRebalancesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetRebalances', 'query', variables);
    },
    GetTopDepositors(variables: GetTopDepositorsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetTopDepositorsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTopDepositorsQuery>(GetTopDepositorsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetTopDepositors', 'query', variables);
    },
    GetUserActivity(variables: GetUserActivityQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUserActivityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserActivityQuery>(GetUserActivityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetUserActivity', 'query', variables);
    },
    GetUsersActivity(variables?: GetUsersActivityQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUsersActivityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUsersActivityQuery>(GetUsersActivityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetUsersActivity', 'query', variables);
    },
    GetVaults(variables?: GetVaultsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetVaultsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetVaultsQuery>(GetVaultsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetVaults', 'query', variables);
    },
    GetVault(variables: GetVaultQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetVaultQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetVaultQuery>(GetVaultDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetVault', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;