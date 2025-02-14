import { ChainId } from '@summerfi/serverless-shared'
import { getSdk } from './generated/client'
import {
  type InterestRate as InterestRateType,
  GetProductsQuery as GetProductsQueryType,
  GetInterestRatesQuery as GetInterestRatesQueryType,
  GetArkRatesQuery as GetArkRatesQueryType,
  GetHistoricalArksRatesQuery as GetHistoricalArksRatesQueryType,
} from './generated/client'
export interface SubgraphClientConfig {
  chainId: ChainId
  urlBase: string
}

export type SubgraphClient = ReturnType<typeof getSdk>

export type GetInterestRatesQuery = GetInterestRatesQueryType
export type GetArkRatesQuery = GetArkRatesQueryType

export type GetHistoricalArksRatesQuery = GetHistoricalArksRatesQueryType

export type InterestRate = InterestRateType
export type Products = GetProductsQueryType['products']
export type Product = Products[number]

export type LatestInterestRate = GetInterestRatesQuery['latestInterestRate']
export type HourlyInterestRates = GetInterestRatesQuery['hourlyInterestRates']
export type DailyInterestRates = GetInterestRatesQuery['dailyInterestRates']
export type WeeklyInterestRates = GetInterestRatesQuery['weeklyInterestRates']
