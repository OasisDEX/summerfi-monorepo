import { Address } from '@summerfi/serverless-shared'
import { CalculatedRates } from '../protocols/types'

export interface TokenApyParams {
  token: {
    address: Address
    symbol: string
  }
  referenceDate: Date
}

export interface TokenApyResult {
  token: {
    address: Address
    symbol: string
  }
  rates: CalculatedRates
}

export interface TokenApyService {
  getTokenApy(params: TokenApyParams): Promise<TokenApyResult>
}
