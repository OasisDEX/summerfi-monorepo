import { Address } from '@summerfi/serverless-shared'
import { GroupedRates } from '../protocols/types'
import { SecondTimestamp } from '../helpers'

export interface TokenApyParams {
  token: {
    address: Address
    symbol: string
  }
  fromTimestamp: SecondTimestamp
  toTimestamp: SecondTimestamp
}

export interface TokenApyResult {
  token: {
    address: Address
    symbol: string
  }
  rates: GroupedRates
}

export interface TokenApyService {
  getTokenApy(params: TokenApyParams): Promise<TokenApyResult>
}
