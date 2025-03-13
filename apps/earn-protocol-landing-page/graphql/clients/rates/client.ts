// This file was automatically generated and should not be edited.
// @ts-nocheck
/* eslint-disable */
import type { DocumentNode } from "graphql/language/ast";
import type { GraphQLClient, RequestOptions } from 'graphql-request';
import { gql } from 'graphql-request';
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
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export enum Aggregation_Interval {
  day = 'day',
  hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type DailyInterestRate = {
  __typename?: 'DailyInterestRate';
  averageRate: Scalars['BigDecimal']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  interestRates: Array<InterestRate>;
  product: Product;
  productId: Scalars['String']['output'];
  protocol: Scalars['String']['output'];
  sumRates: Scalars['BigDecimal']['output'];
  token: Scalars['Bytes']['output'];
  updateCount: Scalars['BigInt']['output'];
};


export type DailyInterestRateInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<InterestRate_Filter>;
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
  interestRates_?: InputMaybe<InterestRate_Filter>;
  or?: InputMaybe<Array<InputMaybe<DailyInterestRate_Filter>>>;
  product?: InputMaybe<Scalars['String']['input']>;
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
  product_?: InputMaybe<Product_Filter>;
  product_contains?: InputMaybe<Scalars['String']['input']>;
  product_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  product_ends_with?: InputMaybe<Scalars['String']['input']>;
  product_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_gt?: InputMaybe<Scalars['String']['input']>;
  product_gte?: InputMaybe<Scalars['String']['input']>;
  product_in?: InputMaybe<Array<Scalars['String']['input']>>;
  product_lt?: InputMaybe<Scalars['String']['input']>;
  product_lte?: InputMaybe<Scalars['String']['input']>;
  product_not?: InputMaybe<Scalars['String']['input']>;
  product_not_contains?: InputMaybe<Scalars['String']['input']>;
  product_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  product_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  product_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  product_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  product_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_starts_with?: InputMaybe<Scalars['String']['input']>;
  product_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
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
  sumRates?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sumRates_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  updateCount?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updateCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum DailyInterestRate_OrderBy {
  averageRate = 'averageRate',
  date = 'date',
  id = 'id',
  interestRates = 'interestRates',
  product = 'product',
  productId = 'productId',
  product__id = 'product__id',
  product__name = 'product__name',
  product__network = 'product__network',
  product__pool = 'product__pool',
  product__protocol = 'product__protocol',
  protocol = 'protocol',
  sumRates = 'sumRates',
  token = 'token',
  updateCount = 'updateCount'
}

export type HourlyInterestRate = {
  __typename?: 'HourlyInterestRate';
  averageRate: Scalars['BigDecimal']['output'];
  date: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  interestRates: Array<InterestRate>;
  product: Product;
  productId: Scalars['String']['output'];
  protocol: Scalars['String']['output'];
  sumRates: Scalars['BigDecimal']['output'];
  token: Scalars['Bytes']['output'];
  updateCount: Scalars['BigInt']['output'];
};


export type HourlyInterestRateInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<InterestRate_Filter>;
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
  interestRates_?: InputMaybe<InterestRate_Filter>;
  or?: InputMaybe<Array<InputMaybe<HourlyInterestRate_Filter>>>;
  product?: InputMaybe<Scalars['String']['input']>;
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
  product_?: InputMaybe<Product_Filter>;
  product_contains?: InputMaybe<Scalars['String']['input']>;
  product_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  product_ends_with?: InputMaybe<Scalars['String']['input']>;
  product_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_gt?: InputMaybe<Scalars['String']['input']>;
  product_gte?: InputMaybe<Scalars['String']['input']>;
  product_in?: InputMaybe<Array<Scalars['String']['input']>>;
  product_lt?: InputMaybe<Scalars['String']['input']>;
  product_lte?: InputMaybe<Scalars['String']['input']>;
  product_not?: InputMaybe<Scalars['String']['input']>;
  product_not_contains?: InputMaybe<Scalars['String']['input']>;
  product_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  product_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  product_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  product_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  product_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_starts_with?: InputMaybe<Scalars['String']['input']>;
  product_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
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
  sumRates?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sumRates_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  updateCount?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updateCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum HourlyInterestRate_OrderBy {
  averageRate = 'averageRate',
  date = 'date',
  id = 'id',
  interestRates = 'interestRates',
  product = 'product',
  productId = 'productId',
  product__id = 'product__id',
  product__name = 'product__name',
  product__network = 'product__network',
  product__pool = 'product__pool',
  product__protocol = 'product__protocol',
  protocol = 'protocol',
  sumRates = 'sumRates',
  token = 'token',
  updateCount = 'updateCount'
}

export type InterestRate = {
  __typename?: 'InterestRate';
  blockNumber: Scalars['BigInt']['output'];
  dailyRateId: DailyInterestRate;
  hourlyRateId: HourlyInterestRate;
  id: Scalars['String']['output'];
  product: Product;
  productId: Scalars['String']['output'];
  protocol: Scalars['String']['output'];
  rate: Scalars['BigDecimal']['output'];
  timestamp: Scalars['BigInt']['output'];
  token: Token;
  type: Scalars['String']['output'];
  weeklyRateId: WeeklyInterestRate;
};

export type InterestRate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<InterestRate_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dailyRateId?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_?: InputMaybe<DailyInterestRate_Filter>;
  dailyRateId_contains?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_ends_with?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_gt?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_gte?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dailyRateId_lt?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_lte?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_not?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_not_contains?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  dailyRateId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_starts_with?: InputMaybe<Scalars['String']['input']>;
  dailyRateId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_?: InputMaybe<HourlyInterestRate_Filter>;
  hourlyRateId_contains?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_ends_with?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_gt?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_gte?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hourlyRateId_lt?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_lte?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_not?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_not_contains?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  hourlyRateId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_starts_with?: InputMaybe<Scalars['String']['input']>;
  hourlyRateId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  or?: InputMaybe<Array<InputMaybe<InterestRate_Filter>>>;
  product?: InputMaybe<Scalars['String']['input']>;
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
  product_?: InputMaybe<Product_Filter>;
  product_contains?: InputMaybe<Scalars['String']['input']>;
  product_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  product_ends_with?: InputMaybe<Scalars['String']['input']>;
  product_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_gt?: InputMaybe<Scalars['String']['input']>;
  product_gte?: InputMaybe<Scalars['String']['input']>;
  product_in?: InputMaybe<Array<Scalars['String']['input']>>;
  product_lt?: InputMaybe<Scalars['String']['input']>;
  product_lte?: InputMaybe<Scalars['String']['input']>;
  product_not?: InputMaybe<Scalars['String']['input']>;
  product_not_contains?: InputMaybe<Scalars['String']['input']>;
  product_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  product_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  product_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  product_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  product_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_starts_with?: InputMaybe<Scalars['String']['input']>;
  product_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
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
  rate?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_?: InputMaybe<WeeklyInterestRate_Filter>;
  weeklyRateId_contains?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_ends_with?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_gt?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_gte?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  weeklyRateId_lt?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_lte?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_not?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_not_contains?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  weeklyRateId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_starts_with?: InputMaybe<Scalars['String']['input']>;
  weeklyRateId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum InterestRate_OrderBy {
  blockNumber = 'blockNumber',
  dailyRateId = 'dailyRateId',
  dailyRateId__averageRate = 'dailyRateId__averageRate',
  dailyRateId__date = 'dailyRateId__date',
  dailyRateId__id = 'dailyRateId__id',
  dailyRateId__productId = 'dailyRateId__productId',
  dailyRateId__protocol = 'dailyRateId__protocol',
  dailyRateId__sumRates = 'dailyRateId__sumRates',
  dailyRateId__token = 'dailyRateId__token',
  dailyRateId__updateCount = 'dailyRateId__updateCount',
  hourlyRateId = 'hourlyRateId',
  hourlyRateId__averageRate = 'hourlyRateId__averageRate',
  hourlyRateId__date = 'hourlyRateId__date',
  hourlyRateId__id = 'hourlyRateId__id',
  hourlyRateId__productId = 'hourlyRateId__productId',
  hourlyRateId__protocol = 'hourlyRateId__protocol',
  hourlyRateId__sumRates = 'hourlyRateId__sumRates',
  hourlyRateId__token = 'hourlyRateId__token',
  hourlyRateId__updateCount = 'hourlyRateId__updateCount',
  id = 'id',
  product = 'product',
  productId = 'productId',
  product__id = 'product__id',
  product__name = 'product__name',
  product__network = 'product__network',
  product__pool = 'product__pool',
  product__protocol = 'product__protocol',
  protocol = 'protocol',
  rate = 'rate',
  timestamp = 'timestamp',
  token = 'token',
  token__address = 'token__address',
  token__decimals = 'token__decimals',
  token__id = 'token__id',
  token__precision = 'token__precision',
  token__symbol = 'token__symbol',
  type = 'type',
  weeklyRateId = 'weeklyRateId',
  weeklyRateId__averageRate = 'weeklyRateId__averageRate',
  weeklyRateId__id = 'weeklyRateId__id',
  weeklyRateId__productId = 'weeklyRateId__productId',
  weeklyRateId__protocol = 'weeklyRateId__protocol',
  weeklyRateId__sumRates = 'weeklyRateId__sumRates',
  weeklyRateId__token = 'weeklyRateId__token',
  weeklyRateId__updateCount = 'weeklyRateId__updateCount',
  weeklyRateId__weekTimestamp = 'weeklyRateId__weekTimestamp'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  asc = 'asc',
  desc = 'desc'
}

export type Product = {
  __typename?: 'Product';
  dailyInterestRates: Array<DailyInterestRate>;
  hourlyInterestRates: Array<HourlyInterestRate>;
  id: Scalars['ID']['output'];
  interestRates: Array<InterestRate>;
  name: Scalars['String']['output'];
  network: Scalars['String']['output'];
  pool: Scalars['String']['output'];
  protocol: Scalars['String']['output'];
  token: Token;
  weeklyInterestRates: Array<WeeklyInterestRate>;
};


export type ProductDailyInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DailyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DailyInterestRate_Filter>;
};


export type ProductHourlyInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<HourlyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<HourlyInterestRate_Filter>;
};


export type ProductInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<InterestRate_Filter>;
};


export type ProductWeeklyInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<WeeklyInterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WeeklyInterestRate_Filter>;
};

export type Product_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Product_Filter>>>;
  dailyInterestRates_?: InputMaybe<DailyInterestRate_Filter>;
  hourlyInterestRates_?: InputMaybe<HourlyInterestRate_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  interestRates_?: InputMaybe<InterestRate_Filter>;
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
  network?: InputMaybe<Scalars['String']['input']>;
  network_contains?: InputMaybe<Scalars['String']['input']>;
  network_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  network_ends_with?: InputMaybe<Scalars['String']['input']>;
  network_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  network_gt?: InputMaybe<Scalars['String']['input']>;
  network_gte?: InputMaybe<Scalars['String']['input']>;
  network_in?: InputMaybe<Array<Scalars['String']['input']>>;
  network_lt?: InputMaybe<Scalars['String']['input']>;
  network_lte?: InputMaybe<Scalars['String']['input']>;
  network_not?: InputMaybe<Scalars['String']['input']>;
  network_not_contains?: InputMaybe<Scalars['String']['input']>;
  network_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  network_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  network_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  network_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  network_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  network_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  network_starts_with?: InputMaybe<Scalars['String']['input']>;
  network_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Product_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
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
  weeklyInterestRates_?: InputMaybe<WeeklyInterestRate_Filter>;
};

export enum Product_OrderBy {
  dailyInterestRates = 'dailyInterestRates',
  hourlyInterestRates = 'hourlyInterestRates',
  id = 'id',
  interestRates = 'interestRates',
  name = 'name',
  network = 'network',
  pool = 'pool',
  protocol = 'protocol',
  token = 'token',
  token__address = 'token__address',
  token__decimals = 'token__decimals',
  token__id = 'token__id',
  token__precision = 'token__precision',
  token__symbol = 'token__symbol',
  weeklyInterestRates = 'weeklyInterestRates'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  dailyInterestRate?: Maybe<DailyInterestRate>;
  dailyInterestRates: Array<DailyInterestRate>;
  hourlyInterestRate?: Maybe<HourlyInterestRate>;
  hourlyInterestRates: Array<HourlyInterestRate>;
  interestRate?: Maybe<InterestRate>;
  interestRates: Array<InterestRate>;
  product?: Maybe<Product>;
  products: Array<Product>;
  timeHelper?: Maybe<TimeHelper>;
  timeHelpers: Array<TimeHelper>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  vaultState?: Maybe<VaultState>;
  vaultStates: Array<VaultState>;
  weeklyInterestRate?: Maybe<WeeklyInterestRate>;
  weeklyInterestRates: Array<WeeklyInterestRate>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
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


export type QueryInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterestRate_Filter>;
};


export type QueryProductArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProductsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Product_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Product_Filter>;
};


export type QueryTimeHelperArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTimeHelpersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TimeHelper_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TimeHelper_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
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


export type QueryVaultStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVaultStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultState_Filter>;
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

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  dailyInterestRate?: Maybe<DailyInterestRate>;
  dailyInterestRates: Array<DailyInterestRate>;
  hourlyInterestRate?: Maybe<HourlyInterestRate>;
  hourlyInterestRates: Array<HourlyInterestRate>;
  interestRate?: Maybe<InterestRate>;
  interestRates: Array<InterestRate>;
  product?: Maybe<Product>;
  products: Array<Product>;
  timeHelper?: Maybe<TimeHelper>;
  timeHelpers: Array<TimeHelper>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  vaultState?: Maybe<VaultState>;
  vaultStates: Array<VaultState>;
  weeklyInterestRate?: Maybe<WeeklyInterestRate>;
  weeklyInterestRates: Array<WeeklyInterestRate>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
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


export type SubscriptionInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterestRate_Filter>;
};


export type SubscriptionProductArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProductsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Product_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Product_Filter>;
};


export type SubscriptionTimeHelperArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTimeHelpersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TimeHelper_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TimeHelper_Filter>;
};


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
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


export type SubscriptionVaultStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVaultStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VaultState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VaultState_Filter>;
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

export type TimeHelper = {
  __typename?: 'TimeHelper';
  id: Scalars['Bytes']['output'];
  lastUpdateTimestamp: Scalars['BigInt']['output'];
};

export type TimeHelper_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TimeHelper_Filter>>>;
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
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TimeHelper_Filter>>>;
};

export enum TimeHelper_OrderBy {
  id = 'id',
  lastUpdateTimestamp = 'lastUpdateTimestamp'
}

export type Token = {
  __typename?: 'Token';
  address: Scalars['Bytes']['output'];
  decimals: Scalars['BigInt']['output'];
  id: Scalars['Bytes']['output'];
  precision: Scalars['BigInt']['output'];
  symbol: Scalars['String']['output'];
};

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  precision?: InputMaybe<Scalars['BigInt']['input']>;
  precision_gt?: InputMaybe<Scalars['BigInt']['input']>;
  precision_gte?: InputMaybe<Scalars['BigInt']['input']>;
  precision_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  precision_lt?: InputMaybe<Scalars['BigInt']['input']>;
  precision_lte?: InputMaybe<Scalars['BigInt']['input']>;
  precision_not?: InputMaybe<Scalars['BigInt']['input']>;
  precision_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  address = 'address',
  decimals = 'decimals',
  id = 'id',
  precision = 'precision',
  symbol = 'symbol'
}

export type VaultState = {
  __typename?: 'VaultState';
  id: Scalars['Bytes']['output'];
  lastSharePrice: Scalars['BigDecimal']['output'];
  lastUpdateTimestamp: Scalars['BigInt']['output'];
};

export type VaultState_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VaultState_Filter>>>;
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
  lastSharePrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastSharePrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastSharePrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastSharePrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastSharePrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastSharePrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastSharePrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastSharePrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastUpdateTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdateTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdateTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VaultState_Filter>>>;
};

export enum VaultState_OrderBy {
  id = 'id',
  lastSharePrice = 'lastSharePrice',
  lastUpdateTimestamp = 'lastUpdateTimestamp'
}

export type WeeklyInterestRate = {
  __typename?: 'WeeklyInterestRate';
  averageRate: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  interestRates: Array<InterestRate>;
  product: Product;
  productId: Scalars['String']['output'];
  protocol: Scalars['String']['output'];
  sumRates: Scalars['BigDecimal']['output'];
  token: Scalars['Bytes']['output'];
  updateCount: Scalars['BigInt']['output'];
  weekTimestamp: Scalars['BigInt']['output'];
};


export type WeeklyInterestRateInterestRatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<InterestRate_Filter>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  interestRates_?: InputMaybe<InterestRate_Filter>;
  or?: InputMaybe<Array<InputMaybe<WeeklyInterestRate_Filter>>>;
  product?: InputMaybe<Scalars['String']['input']>;
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
  product_?: InputMaybe<Product_Filter>;
  product_contains?: InputMaybe<Scalars['String']['input']>;
  product_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  product_ends_with?: InputMaybe<Scalars['String']['input']>;
  product_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_gt?: InputMaybe<Scalars['String']['input']>;
  product_gte?: InputMaybe<Scalars['String']['input']>;
  product_in?: InputMaybe<Array<Scalars['String']['input']>>;
  product_lt?: InputMaybe<Scalars['String']['input']>;
  product_lte?: InputMaybe<Scalars['String']['input']>;
  product_not?: InputMaybe<Scalars['String']['input']>;
  product_not_contains?: InputMaybe<Scalars['String']['input']>;
  product_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  product_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  product_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  product_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  product_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  product_starts_with?: InputMaybe<Scalars['String']['input']>;
  product_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
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
  sumRates?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sumRates_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sumRates_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  updateCount?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updateCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  updateCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weekTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  weekTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  weekTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  weekTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  weekTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  weekTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  weekTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  weekTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum WeeklyInterestRate_OrderBy {
  averageRate = 'averageRate',
  id = 'id',
  interestRates = 'interestRates',
  product = 'product',
  productId = 'productId',
  product__id = 'product__id',
  product__name = 'product__name',
  product__network = 'product__network',
  product__pool = 'product__pool',
  product__protocol = 'product__protocol',
  protocol = 'protocol',
  sumRates = 'sumRates',
  token = 'token',
  updateCount = 'updateCount',
  weekTimestamp = 'weekTimestamp'
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
  allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  deny = 'deny'
}

export type GetInterestRatesQueryVariables = Exact<{
  productId: Scalars['String']['input'];
}>;


export type GetInterestRatesQuery = { __typename?: 'Query', dailyInterestRates: Array<{ __typename?: 'DailyInterestRate', averageRate: number, date: number }>, hourlyInterestRates: Array<{ __typename?: 'HourlyInterestRate', averageRate: number, date: number }>, weeklyInterestRates: Array<{ __typename?: 'WeeklyInterestRate', averageRate: number, date: number }>, latestInterestRate: Array<{ __typename?: 'HourlyInterestRate', rate: Array<{ __typename?: 'InterestRate', rate: number, timestamp: number }> }> };


export const GetInterestRatesDocument = /*#__PURE__*/ gql`
    query GetInterestRates($productId: String!) {
  dailyInterestRates(
    where: {productId: $productId}
    first: 365
    orderBy: date
    orderDirection: desc
  ) {
    averageRate
    date
  }
  hourlyInterestRates(
    where: {productId: $productId}
    first: 720
    orderBy: date
    orderDirection: desc
  ) {
    averageRate
    date
  }
  weeklyInterestRates(
    where: {productId: $productId}
    first: 156
    orderBy: weekTimestamp
    orderDirection: desc
  ) {
    averageRate
    date: weekTimestamp
  }
  latestInterestRate: hourlyInterestRates(
    where: {productId: $productId}
    first: 1
    orderBy: date
    orderDirection: desc
  ) {
    rate: interestRates(first: 1, orderBy: timestamp, orderDirection: desc) {
      rate
      timestamp
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetInterestRates(variables: GetInterestRatesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetInterestRatesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetInterestRatesQuery>(GetInterestRatesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetInterestRates', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;