import { Currency, Token } from '~sdk/common'

export function isToken(maybeToken: any): maybeToken is Token {
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

export function isCurrency(maybeCurrency: any): maybeCurrency is Currency {
  return Object.values(Currency).includes(maybeCurrency as Currency)
}
