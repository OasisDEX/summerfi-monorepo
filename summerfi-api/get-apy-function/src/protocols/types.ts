import { ProtocolId, Token } from '@summerfi/serverless-shared'
import { ShortDate } from '../helpers'

export interface InterestRate {
  rate: number
  type: 'borrow' | 'lend'
  toTimestamp: number
  fromTimestamp: number
  duration: number
}

export interface BorrowRatesParams {
  interestRates: {
    borrow: InterestRate[]
  }
}

export interface SupplyRatesParams {
  interestRates: {
    lend: InterestRate[]
  }
}

export interface InterestRates {
  interestRates: {
    borrow: InterestRate[]
    lend: InterestRate[]
  }
}

export interface RatesWithAverage {
  rates: InterestRate[]
  averageRate: number
}

export type GroupedRates = ReadonlyMap<ShortDate, Readonly<RatesWithAverage>>

export interface CalculateRates {
  apy1d: number
  apy7d: number
  apy30d: number
  apy90d: number
  apy365d: number
}

export interface ProtocolResponse<TProtocolData> {
  protocol: ProtocolId
  protocolData: TProtocolData
  supplyRates: GroupedRates
  borrowRates: GroupedRates
  tokens: {
    supplied: Token
    borrowed: Token
  }
}
