import { ProtocolId, Token } from '@summerfi/serverless-shared'

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

export interface CalculatedRates {
  apy1d: number
  apy7d: number
  apy30d: number
  apy90d: number
  apy365d: number
}

export interface ProtocolResponse<TProtocolData> {
  protocol: ProtocolId
  protocolData: TProtocolData
  supplyRates: CalculatedRates
  borrowRates: CalculatedRates
  tokens: {
    supplied: Token
    borrowed: Token
  }
}
