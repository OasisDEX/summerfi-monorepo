import { Currency, Token } from '~sdk/common'
import { Maybe } from './Maybe'

export function isToken(maybeToken: Maybe<Token | Currency>): maybeToken is Token {
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

export function isCurrency(maybeCurrency: Maybe<Token | Currency>): maybeCurrency is Currency {
  return Object.values(Currency).includes(maybeCurrency as Currency)
}
