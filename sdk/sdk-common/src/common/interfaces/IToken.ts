import { IAddress } from './IAddress'
import { IChainInfo } from './IChainInfo'

export interface IToken {
  chainInfo: IChainInfo
  address: IAddress
  symbol: string
  name: string
  decimals: number
}

export function isToken(maybeToken: unknown): maybeToken is IToken {
  return (
    typeof maybeToken === 'object' &&
    maybeToken !== null &&
    'chainInfo' in maybeToken &&
    'address' in maybeToken &&
    'symbol' in maybeToken &&
    'name' in maybeToken &&
    'decimals' in maybeToken
  )
}
