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

/** Indicates whether the current, partially filled bucket should be included in the response. Defaults to `exclude` */
export enum Aggregation_Current {
  /** Exclude the current, partially filled bucket from the response */
  Exclude = 'exclude',
  /** Include the current, partially filled bucket in the response */
  Include = 'include'
}

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

/**
 * Logged whenever the proxy emits `AggregatorConfirmed(previous, latest)` —
 * i.e. Chainlink rotates the implementation behind the proxy. Lets the FE
 * mark the chart at the rotation block and is the audit trail for round
 * discontinuities.
 */
export type AggregatorRotation = {
  __typename?: 'AggregatorRotation';
  blockNumber: Scalars['BigInt']['output'];
  feed: PriceFeed;
  /** {proxyAddrHex}-{blockNumber}-{logIndex} */
  id: Scalars['String']['output'];
  latest: Scalars['Bytes']['output'];
  previous: Scalars['Bytes']['output'];
  timestamp: Scalars['BigInt']['output'];
};

export type AggregatorRotation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AggregatorRotation_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feed?: InputMaybe<Scalars['String']['input']>;
  feed_?: InputMaybe<PriceFeed_Filter>;
  feed_contains?: InputMaybe<Scalars['String']['input']>;
  feed_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_ends_with?: InputMaybe<Scalars['String']['input']>;
  feed_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_gt?: InputMaybe<Scalars['String']['input']>;
  feed_gte?: InputMaybe<Scalars['String']['input']>;
  feed_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feed_lt?: InputMaybe<Scalars['String']['input']>;
  feed_lte?: InputMaybe<Scalars['String']['input']>;
  feed_not?: InputMaybe<Scalars['String']['input']>;
  feed_not_contains?: InputMaybe<Scalars['String']['input']>;
  feed_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  feed_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feed_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  feed_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_starts_with?: InputMaybe<Scalars['String']['input']>;
  feed_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latest?: InputMaybe<Scalars['Bytes']['input']>;
  latest_contains?: InputMaybe<Scalars['Bytes']['input']>;
  latest_gt?: InputMaybe<Scalars['Bytes']['input']>;
  latest_gte?: InputMaybe<Scalars['Bytes']['input']>;
  latest_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  latest_lt?: InputMaybe<Scalars['Bytes']['input']>;
  latest_lte?: InputMaybe<Scalars['Bytes']['input']>;
  latest_not?: InputMaybe<Scalars['Bytes']['input']>;
  latest_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  latest_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AggregatorRotation_Filter>>>;
  previous?: InputMaybe<Scalars['Bytes']['input']>;
  previous_contains?: InputMaybe<Scalars['Bytes']['input']>;
  previous_gt?: InputMaybe<Scalars['Bytes']['input']>;
  previous_gte?: InputMaybe<Scalars['Bytes']['input']>;
  previous_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  previous_lt?: InputMaybe<Scalars['Bytes']['input']>;
  previous_lte?: InputMaybe<Scalars['Bytes']['input']>;
  previous_not?: InputMaybe<Scalars['Bytes']['input']>;
  previous_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  previous_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum AggregatorRotation_OrderBy {
  BlockNumber = 'blockNumber',
  Feed = 'feed',
  FeedAggregator = 'feed__aggregator',
  FeedDecimals = 'feed__decimals',
  FeedDescription = 'feed__description',
  FeedFirstSeenAt = 'feed__firstSeenAt',
  FeedFirstSeenBlock = 'feed__firstSeenBlock',
  FeedId = 'feed__id',
  FeedLatestAnswer = 'feed__latestAnswer',
  FeedLatestRoundId = 'feed__latestRoundId',
  FeedLatestUpdatedAt = 'feed__latestUpdatedAt',
  Id = 'id',
  Latest = 'latest',
  Previous = 'previous',
  Timestamp = 'timestamp'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Execution = {
  __typename?: 'Execution';
  amountIn: Scalars['BigInt']['output'];
  amountOut: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  executionTimestamp: Scalars['BigInt']['output'];
  /** {strategyId}-{txHashHex}-{logIndex} */
  id: Scalars['String']['output'];
  logIndex: Scalars['Int']['output'];
  strategy: Strategy;
  tradesExecutedAfter: Scalars['BigInt']['output'];
  txHash: Scalars['Bytes']['output'];
};

export type Execution_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountIn?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountIn_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountIn_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountOut?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amountOut_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_not?: InputMaybe<Scalars['BigInt']['input']>;
  amountOut_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Execution_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  executionTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executionTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executionTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executionTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executionTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  executionTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Execution_Filter>>>;
  strategy?: InputMaybe<Scalars['String']['input']>;
  strategy_?: InputMaybe<Strategy_Filter>;
  strategy_contains?: InputMaybe<Scalars['String']['input']>;
  strategy_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  strategy_ends_with?: InputMaybe<Scalars['String']['input']>;
  strategy_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  strategy_gt?: InputMaybe<Scalars['String']['input']>;
  strategy_gte?: InputMaybe<Scalars['String']['input']>;
  strategy_in?: InputMaybe<Array<Scalars['String']['input']>>;
  strategy_lt?: InputMaybe<Scalars['String']['input']>;
  strategy_lte?: InputMaybe<Scalars['String']['input']>;
  strategy_not?: InputMaybe<Scalars['String']['input']>;
  strategy_not_contains?: InputMaybe<Scalars['String']['input']>;
  strategy_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  strategy_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  strategy_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  strategy_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  strategy_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  strategy_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  strategy_starts_with?: InputMaybe<Scalars['String']['input']>;
  strategy_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tradesExecutedAfter?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecutedAfter_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecutedAfter_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecutedAfter_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradesExecutedAfter_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecutedAfter_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecutedAfter_not?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecutedAfter_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txHash?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  txHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum Execution_OrderBy {
  AmountIn = 'amountIn',
  AmountOut = 'amountOut',
  BlockNumber = 'blockNumber',
  ExecutionTimestamp = 'executionTimestamp',
  Id = 'id',
  LogIndex = 'logIndex',
  Strategy = 'strategy',
  StrategyCreatedAt = 'strategy__createdAt',
  StrategyCreatedAtBlock = 'strategy__createdAtBlock',
  StrategyEndDate = 'strategy__endDate',
  StrategyId = 'strategy__id',
  StrategyInAsset = 'strategy__inAsset',
  StrategyInAssetFeed = 'strategy__inAssetFeed',
  StrategyInterval = 'strategy__interval',
  StrategyLastScheduledAt = 'strategy__lastScheduledAt',
  StrategyMaxPrice = 'strategy__maxPrice',
  StrategyMaxTrades = 'strategy__maxTrades',
  StrategyMinPrice = 'strategy__minPrice',
  StrategyNextTriggerAt = 'strategy__nextTriggerAt',
  StrategyOutAsset = 'strategy__outAsset',
  StrategyOutAssetFeed = 'strategy__outAssetFeed',
  StrategySlippageBps = 'strategy__slippageBps',
  StrategySourceVault = 'strategy__sourceVault',
  StrategyStatus = 'strategy__status',
  StrategyStrategyId = 'strategy__strategyId',
  StrategyTargetVault = 'strategy__targetVault',
  StrategyTotalInAssetSwapped = 'strategy__totalInAssetSwapped',
  StrategyTotalOutAssetReceived = 'strategy__totalOutAssetReceived',
  StrategyTradeAmount = 'strategy__tradeAmount',
  StrategyTradesExecuted = 'strategy__tradesExecuted',
  StrategyUpdatedAt = 'strategy__updatedAt',
  StrategyUpdatedAtBlock = 'strategy__updatedAtBlock',
  TradesExecutedAfter = 'tradesExecutedAfter',
  TxHash = 'txHash'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

/**
 * A Chainlink price feed we index, keyed by the proxy address the user
 * references in `Strategy.in/outAssetFeed`. USDC/USD and ETH/USD are seeded
 * at deploy via static dataSources whose `startBlock` is pushed ~14 days
 * before the DCAStrategyManager deploy block, so the FE has a baseline price
 * history on day one. Every other feed begins indexing the block its address
 * first appears in `StrategyCreated`/`StrategyEdited` (see `registerFeed` in
 * src/common/initializers.ts).
 *
 * The Chainlink proxy is just a forwarder — the actual `AnswerUpdated` event
 * fires from the underlying aggregator implementation. We track both: the
 * proxy address for `AggregatorConfirmed` (impl rotations), and the current
 * impl for `AnswerUpdated` (round stream). `aggregator` below reflects the
 * current impl.
 */
export type PriceFeed = {
  __typename?: 'PriceFeed';
  /** Current aggregator implementation behind the proxy. */
  aggregator: Scalars['Bytes']['output'];
  decimals: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  firstSeenAt: Scalars['BigInt']['output'];
  firstSeenBlock: Scalars['BigInt']['output'];
  /** Aggregator proxy address — lowercased Bytes */
  id: Scalars['Bytes']['output'];
  latestAnswer: Scalars['BigInt']['output'];
  latestRoundId: Scalars['BigInt']['output'];
  latestUpdatedAt: Scalars['BigInt']['output'];
  rotations: Array<AggregatorRotation>;
  rounds: Array<PriceRound>;
};


/**
 * A Chainlink price feed we index, keyed by the proxy address the user
 * references in `Strategy.in/outAssetFeed`. USDC/USD and ETH/USD are seeded
 * at deploy via static dataSources whose `startBlock` is pushed ~14 days
 * before the DCAStrategyManager deploy block, so the FE has a baseline price
 * history on day one. Every other feed begins indexing the block its address
 * first appears in `StrategyCreated`/`StrategyEdited` (see `registerFeed` in
 * src/common/initializers.ts).
 *
 * The Chainlink proxy is just a forwarder — the actual `AnswerUpdated` event
 * fires from the underlying aggregator implementation. We track both: the
 * proxy address for `AggregatorConfirmed` (impl rotations), and the current
 * impl for `AnswerUpdated` (round stream). `aggregator` below reflects the
 * current impl.
 */
export type PriceFeedRotationsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AggregatorRotation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AggregatorRotation_Filter>;
};


/**
 * A Chainlink price feed we index, keyed by the proxy address the user
 * references in `Strategy.in/outAssetFeed`. USDC/USD and ETH/USD are seeded
 * at deploy via static dataSources whose `startBlock` is pushed ~14 days
 * before the DCAStrategyManager deploy block, so the FE has a baseline price
 * history on day one. Every other feed begins indexing the block its address
 * first appears in `StrategyCreated`/`StrategyEdited` (see `registerFeed` in
 * src/common/initializers.ts).
 *
 * The Chainlink proxy is just a forwarder — the actual `AnswerUpdated` event
 * fires from the underlying aggregator implementation. We track both: the
 * proxy address for `AggregatorConfirmed` (impl rotations), and the current
 * impl for `AnswerUpdated` (round stream). `aggregator` below reflects the
 * current impl.
 */
export type PriceFeedRoundsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceRound_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PriceRound_Filter>;
};

export type PriceFeed_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  aggregator?: InputMaybe<Scalars['Bytes']['input']>;
  aggregator_contains?: InputMaybe<Scalars['Bytes']['input']>;
  aggregator_gt?: InputMaybe<Scalars['Bytes']['input']>;
  aggregator_gte?: InputMaybe<Scalars['Bytes']['input']>;
  aggregator_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  aggregator_lt?: InputMaybe<Scalars['Bytes']['input']>;
  aggregator_lte?: InputMaybe<Scalars['Bytes']['input']>;
  aggregator_not?: InputMaybe<Scalars['Bytes']['input']>;
  aggregator_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  aggregator_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PriceFeed_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  firstSeenAt?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  firstSeenAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  firstSeenBlock?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  firstSeenBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  firstSeenBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  latestAnswer?: InputMaybe<Scalars['BigInt']['input']>;
  latestAnswer_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestAnswer_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestAnswer_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestAnswer_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestAnswer_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestAnswer_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestAnswer_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestRoundId?: InputMaybe<Scalars['BigInt']['input']>;
  latestRoundId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestRoundId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestRoundId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestRoundId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestRoundId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestRoundId_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestRoundId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestUpdatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  latestUpdatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestUpdatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestUpdatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestUpdatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestUpdatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestUpdatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestUpdatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PriceFeed_Filter>>>;
  rotations_?: InputMaybe<AggregatorRotation_Filter>;
  rounds_?: InputMaybe<PriceRound_Filter>;
};

export enum PriceFeed_OrderBy {
  Aggregator = 'aggregator',
  Decimals = 'decimals',
  Description = 'description',
  FirstSeenAt = 'firstSeenAt',
  FirstSeenBlock = 'firstSeenBlock',
  Id = 'id',
  LatestAnswer = 'latestAnswer',
  LatestRoundId = 'latestRoundId',
  LatestUpdatedAt = 'latestUpdatedAt',
  Rotations = 'rotations',
  Rounds = 'rounds'
}

/**
 * One round per `AnswerUpdated` event observed from the current aggregator
 * implementation. `updatedAt` is the Chainlink-reported timestamp from the
 * event payload (NOT block timestamp). `id = {proxyAddrHex}-{roundId}` keeps
 * rounds stable across impl rotations.
 */
export type PriceRound = {
  __typename?: 'PriceRound';
  answer: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  feed: PriceFeed;
  /** {proxyAddrHex}-{roundId} */
  id: Scalars['String']['output'];
  logIndex: Scalars['Int']['output'];
  roundId: Scalars['BigInt']['output'];
  txHash: Scalars['Bytes']['output'];
  /** Chainlink-reported `updatedAt` (seconds) from the event payload. */
  updatedAt: Scalars['BigInt']['output'];
};

export type PriceRound_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PriceRound_Filter>>>;
  answer?: InputMaybe<Scalars['BigInt']['input']>;
  answer_gt?: InputMaybe<Scalars['BigInt']['input']>;
  answer_gte?: InputMaybe<Scalars['BigInt']['input']>;
  answer_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  answer_lt?: InputMaybe<Scalars['BigInt']['input']>;
  answer_lte?: InputMaybe<Scalars['BigInt']['input']>;
  answer_not?: InputMaybe<Scalars['BigInt']['input']>;
  answer_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feed?: InputMaybe<Scalars['String']['input']>;
  feed_?: InputMaybe<PriceFeed_Filter>;
  feed_contains?: InputMaybe<Scalars['String']['input']>;
  feed_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_ends_with?: InputMaybe<Scalars['String']['input']>;
  feed_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_gt?: InputMaybe<Scalars['String']['input']>;
  feed_gte?: InputMaybe<Scalars['String']['input']>;
  feed_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feed_lt?: InputMaybe<Scalars['String']['input']>;
  feed_lte?: InputMaybe<Scalars['String']['input']>;
  feed_not?: InputMaybe<Scalars['String']['input']>;
  feed_not_contains?: InputMaybe<Scalars['String']['input']>;
  feed_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  feed_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  feed_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  feed_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  feed_starts_with?: InputMaybe<Scalars['String']['input']>;
  feed_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  logIndex?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  logIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not?: InputMaybe<Scalars['Int']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PriceRound_Filter>>>;
  roundId?: InputMaybe<Scalars['BigInt']['input']>;
  roundId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  roundId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  roundId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  roundId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  roundId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  roundId_not?: InputMaybe<Scalars['BigInt']['input']>;
  roundId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txHash?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  txHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum PriceRound_OrderBy {
  Answer = 'answer',
  BlockNumber = 'blockNumber',
  Feed = 'feed',
  FeedAggregator = 'feed__aggregator',
  FeedDecimals = 'feed__decimals',
  FeedDescription = 'feed__description',
  FeedFirstSeenAt = 'feed__firstSeenAt',
  FeedFirstSeenBlock = 'feed__firstSeenBlock',
  FeedId = 'feed__id',
  FeedLatestAnswer = 'feed__latestAnswer',
  FeedLatestRoundId = 'feed__latestRoundId',
  FeedLatestUpdatedAt = 'feed__latestUpdatedAt',
  Id = 'id',
  LogIndex = 'logIndex',
  RoundId = 'roundId',
  TxHash = 'txHash',
  UpdatedAt = 'updatedAt'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  aggregatorRotation?: Maybe<AggregatorRotation>;
  aggregatorRotations: Array<AggregatorRotation>;
  execution?: Maybe<Execution>;
  executions: Array<Execution>;
  priceFeed?: Maybe<PriceFeed>;
  priceFeeds: Array<PriceFeed>;
  priceRound?: Maybe<PriceRound>;
  priceRounds: Array<PriceRound>;
  strategies: Array<Strategy>;
  strategy?: Maybe<Strategy>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAggregatorRotationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAggregatorRotationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AggregatorRotation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AggregatorRotation_Filter>;
};


export type QueryExecutionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryExecutionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Execution_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Execution_Filter>;
};


export type QueryPriceFeedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPriceFeedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceFeed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceFeed_Filter>;
};


export type QueryPriceRoundArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPriceRoundsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceRound_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceRound_Filter>;
};


export type QueryStrategiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Strategy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Strategy_Filter>;
};


export type QueryStrategyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Strategy = {
  __typename?: 'Strategy';
  createdAt: Scalars['BigInt']['output'];
  createdAtBlock: Scalars['BigInt']['output'];
  endDate: Scalars['BigInt']['output'];
  executions: Array<Execution>;
  /** strategyId.toString() */
  id: Scalars['String']['output'];
  inAsset: Scalars['Bytes']['output'];
  inAssetFeed: Scalars['Bytes']['output'];
  interval: Scalars['BigInt']['output'];
  lastScheduledAt: Scalars['BigInt']['output'];
  /** Ceiling on the 1e18-scaled out/in execution-price ratio (outPrice * 10**inOracleDec * 1e18 / (inPrice * 10**outOracleDec)). 0 means no ceiling. */
  maxPrice: Scalars['BigInt']['output'];
  maxTrades: Scalars['BigInt']['output'];
  /** Floor on the 1e18-scaled out/in execution-price ratio (same formula as maxPrice). 0 means no floor. */
  minPrice: Scalars['BigInt']['output'];
  nextTriggerAt: Scalars['BigInt']['output'];
  outAsset: Scalars['Bytes']['output'];
  outAssetFeed: Scalars['Bytes']['output'];
  owner: User;
  slippageBps: Scalars['BigInt']['output'];
  sourceVault: Scalars['Bytes']['output'];
  /** ACTIVE | PAUSED | CANCELLED | COMPLETED */
  status: Scalars['String']['output'];
  strategyId: Scalars['BigInt']['output'];
  targetVault: Scalars['Bytes']['output'];
  totalInAssetSwapped: Scalars['BigInt']['output'];
  totalOutAssetReceived: Scalars['BigInt']['output'];
  tradeAmount: Scalars['BigInt']['output'];
  tradesExecuted: Scalars['BigInt']['output'];
  updatedAt: Scalars['BigInt']['output'];
  updatedAtBlock: Scalars['BigInt']['output'];
};


export type StrategyExecutionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Execution_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Execution_Filter>;
};

export type Strategy_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Strategy_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endDate?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  endDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executions_?: InputMaybe<Execution_Filter>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  inAsset?: InputMaybe<Scalars['Bytes']['input']>;
  inAssetFeed?: InputMaybe<Scalars['Bytes']['input']>;
  inAssetFeed_contains?: InputMaybe<Scalars['Bytes']['input']>;
  inAssetFeed_gt?: InputMaybe<Scalars['Bytes']['input']>;
  inAssetFeed_gte?: InputMaybe<Scalars['Bytes']['input']>;
  inAssetFeed_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  inAssetFeed_lt?: InputMaybe<Scalars['Bytes']['input']>;
  inAssetFeed_lte?: InputMaybe<Scalars['Bytes']['input']>;
  inAssetFeed_not?: InputMaybe<Scalars['Bytes']['input']>;
  inAssetFeed_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  inAssetFeed_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  inAsset_contains?: InputMaybe<Scalars['Bytes']['input']>;
  inAsset_gt?: InputMaybe<Scalars['Bytes']['input']>;
  inAsset_gte?: InputMaybe<Scalars['Bytes']['input']>;
  inAsset_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  inAsset_lt?: InputMaybe<Scalars['Bytes']['input']>;
  inAsset_lte?: InputMaybe<Scalars['Bytes']['input']>;
  inAsset_not?: InputMaybe<Scalars['Bytes']['input']>;
  inAsset_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  inAsset_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  interval?: InputMaybe<Scalars['BigInt']['input']>;
  interval_gt?: InputMaybe<Scalars['BigInt']['input']>;
  interval_gte?: InputMaybe<Scalars['BigInt']['input']>;
  interval_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  interval_lt?: InputMaybe<Scalars['BigInt']['input']>;
  interval_lte?: InputMaybe<Scalars['BigInt']['input']>;
  interval_not?: InputMaybe<Scalars['BigInt']['input']>;
  interval_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastScheduledAt?: InputMaybe<Scalars['BigInt']['input']>;
  lastScheduledAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastScheduledAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastScheduledAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastScheduledAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastScheduledAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastScheduledAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastScheduledAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxPrice?: InputMaybe<Scalars['BigInt']['input']>;
  maxPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxTrades?: InputMaybe<Scalars['BigInt']['input']>;
  maxTrades_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxTrades_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxTrades_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxTrades_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxTrades_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxTrades_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxTrades_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minPrice?: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nextTriggerAt?: InputMaybe<Scalars['BigInt']['input']>;
  nextTriggerAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nextTriggerAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nextTriggerAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nextTriggerAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nextTriggerAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nextTriggerAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  nextTriggerAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Strategy_Filter>>>;
  outAsset?: InputMaybe<Scalars['Bytes']['input']>;
  outAssetFeed?: InputMaybe<Scalars['Bytes']['input']>;
  outAssetFeed_contains?: InputMaybe<Scalars['Bytes']['input']>;
  outAssetFeed_gt?: InputMaybe<Scalars['Bytes']['input']>;
  outAssetFeed_gte?: InputMaybe<Scalars['Bytes']['input']>;
  outAssetFeed_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  outAssetFeed_lt?: InputMaybe<Scalars['Bytes']['input']>;
  outAssetFeed_lte?: InputMaybe<Scalars['Bytes']['input']>;
  outAssetFeed_not?: InputMaybe<Scalars['Bytes']['input']>;
  outAssetFeed_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  outAssetFeed_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  outAsset_contains?: InputMaybe<Scalars['Bytes']['input']>;
  outAsset_gt?: InputMaybe<Scalars['Bytes']['input']>;
  outAsset_gte?: InputMaybe<Scalars['Bytes']['input']>;
  outAsset_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  outAsset_lt?: InputMaybe<Scalars['Bytes']['input']>;
  outAsset_lte?: InputMaybe<Scalars['Bytes']['input']>;
  outAsset_not?: InputMaybe<Scalars['Bytes']['input']>;
  outAsset_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  outAsset_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<User_Filter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slippageBps?: InputMaybe<Scalars['BigInt']['input']>;
  slippageBps_gt?: InputMaybe<Scalars['BigInt']['input']>;
  slippageBps_gte?: InputMaybe<Scalars['BigInt']['input']>;
  slippageBps_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  slippageBps_lt?: InputMaybe<Scalars['BigInt']['input']>;
  slippageBps_lte?: InputMaybe<Scalars['BigInt']['input']>;
  slippageBps_not?: InputMaybe<Scalars['BigInt']['input']>;
  slippageBps_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sourceVault?: InputMaybe<Scalars['Bytes']['input']>;
  sourceVault_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sourceVault_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sourceVault_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sourceVault_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sourceVault_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sourceVault_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sourceVault_not?: InputMaybe<Scalars['Bytes']['input']>;
  sourceVault_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sourceVault_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_contains?: InputMaybe<Scalars['String']['input']>;
  status_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  status_ends_with?: InputMaybe<Scalars['String']['input']>;
  status_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  status_gt?: InputMaybe<Scalars['String']['input']>;
  status_gte?: InputMaybe<Scalars['String']['input']>;
  status_in?: InputMaybe<Array<Scalars['String']['input']>>;
  status_lt?: InputMaybe<Scalars['String']['input']>;
  status_lte?: InputMaybe<Scalars['String']['input']>;
  status_not?: InputMaybe<Scalars['String']['input']>;
  status_not_contains?: InputMaybe<Scalars['String']['input']>;
  status_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  status_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  status_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  status_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  status_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  status_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  status_starts_with?: InputMaybe<Scalars['String']['input']>;
  status_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  strategyId?: InputMaybe<Scalars['BigInt']['input']>;
  strategyId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  strategyId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  strategyId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  strategyId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  strategyId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  strategyId_not?: InputMaybe<Scalars['BigInt']['input']>;
  strategyId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  targetVault?: InputMaybe<Scalars['Bytes']['input']>;
  targetVault_contains?: InputMaybe<Scalars['Bytes']['input']>;
  targetVault_gt?: InputMaybe<Scalars['Bytes']['input']>;
  targetVault_gte?: InputMaybe<Scalars['Bytes']['input']>;
  targetVault_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targetVault_lt?: InputMaybe<Scalars['Bytes']['input']>;
  targetVault_lte?: InputMaybe<Scalars['Bytes']['input']>;
  targetVault_not?: InputMaybe<Scalars['Bytes']['input']>;
  targetVault_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  targetVault_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  totalInAssetSwapped?: InputMaybe<Scalars['BigInt']['input']>;
  totalInAssetSwapped_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalInAssetSwapped_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalInAssetSwapped_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalInAssetSwapped_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalInAssetSwapped_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalInAssetSwapped_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalInAssetSwapped_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalOutAssetReceived?: InputMaybe<Scalars['BigInt']['input']>;
  totalOutAssetReceived_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalOutAssetReceived_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalOutAssetReceived_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalOutAssetReceived_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalOutAssetReceived_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalOutAssetReceived_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalOutAssetReceived_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeAmount?: InputMaybe<Scalars['BigInt']['input']>;
  tradeAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tradeAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tradeAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradeAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tradeAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tradeAmount_not?: InputMaybe<Scalars['BigInt']['input']>;
  tradeAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradesExecuted?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecuted_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecuted_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecuted_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tradesExecuted_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecuted_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecuted_not?: InputMaybe<Scalars['BigInt']['input']>;
  tradesExecuted_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAtBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAtBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Strategy_OrderBy {
  CreatedAt = 'createdAt',
  CreatedAtBlock = 'createdAtBlock',
  EndDate = 'endDate',
  Executions = 'executions',
  Id = 'id',
  InAsset = 'inAsset',
  InAssetFeed = 'inAssetFeed',
  Interval = 'interval',
  LastScheduledAt = 'lastScheduledAt',
  MaxPrice = 'maxPrice',
  MaxTrades = 'maxTrades',
  MinPrice = 'minPrice',
  NextTriggerAt = 'nextTriggerAt',
  OutAsset = 'outAsset',
  OutAssetFeed = 'outAssetFeed',
  Owner = 'owner',
  OwnerCreatedAt = 'owner__createdAt',
  OwnerId = 'owner__id',
  SlippageBps = 'slippageBps',
  SourceVault = 'sourceVault',
  Status = 'status',
  StrategyId = 'strategyId',
  TargetVault = 'targetVault',
  TotalInAssetSwapped = 'totalInAssetSwapped',
  TotalOutAssetReceived = 'totalOutAssetReceived',
  TradeAmount = 'tradeAmount',
  TradesExecuted = 'tradesExecuted',
  UpdatedAt = 'updatedAt',
  UpdatedAtBlock = 'updatedAtBlock'
}

export type User = {
  __typename?: 'User';
  createdAt: Scalars['BigInt']['output'];
  /** Owner address */
  id: Scalars['Bytes']['output'];
  strategies: Array<Strategy>;
};


export type UserStrategiesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Strategy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Strategy_Filter>;
};

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  strategies_?: InputMaybe<Strategy_Filter>;
};

export enum User_OrderBy {
  CreatedAt = 'createdAt',
  Id = 'id',
  Strategies = 'strategies'
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

export type GetExecutionsQueryVariables = Exact<{
  strategy_id: Scalars['String']['input'];
}>;


export type GetExecutionsQuery = { __typename?: 'Query', executions: Array<{ __typename?: 'Execution', id: string, txHash: string, executionTimestamp: bigint, amountIn: bigint, amountOut: bigint, tradesExecutedAfter: bigint }> };

export type GetStrategiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStrategiesQuery = { __typename?: 'Query', strategies: Array<{ __typename?: 'Strategy', id: string, strategyId: bigint, sourceVault: string, targetVault: string, inAsset: string, outAsset: string, inAssetFeed: string, outAssetFeed: string, inAssetFeedStaleness: bigint, outAssetFeedStaleness: bigint, tradeAmount: bigint, interval: bigint, slippageBps: bigint, maxPrice: bigint, minPrice: bigint, endDate: bigint, maxTrades: bigint, status: string, nextTriggerAt: bigint, lastScheduledAt: bigint, createdAt: bigint, updatedAt: bigint, tradesExecuted: bigint, totalInAssetSwapped: bigint, totalOutAssetReceived: bigint, owner: { __typename?: 'User', id: string } }> };


export const GetExecutionsDocument = gql`
    query GetExecutions($strategy_id: String!) {
  executions(where: {strategy_: {id_contains_nocase: $strategy_id}}) {
    id
    txHash
    executionTimestamp
    amountIn
    amountOut
    tradesExecutedAfter
  }
}
    `;
export const GetStrategiesDocument = gql`
    query GetStrategies {
  strategies {
    id
    strategyId
    owner {
      id
    }
    sourceVault
    targetVault
    inAsset
    outAsset
    inAssetFeed
    outAssetFeed
    inAssetFeedStaleness
    outAssetFeedStaleness
    tradeAmount
    interval
    slippageBps
    maxPrice
    minPrice
    endDate
    maxTrades
    status
    nextTriggerAt
    lastScheduledAt
    createdAt
    updatedAt
    tradesExecuted
    totalInAssetSwapped
    totalOutAssetReceived
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetExecutions(variables: GetExecutionsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetExecutionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetExecutionsQuery>({ document: GetExecutionsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetExecutions', 'query', variables);
    },
    GetStrategies(variables?: GetStrategiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetStrategiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetStrategiesQuery>({ document: GetStrategiesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetStrategies', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;