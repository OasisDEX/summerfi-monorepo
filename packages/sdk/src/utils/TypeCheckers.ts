import { Currency, Token } from '~sdk/common'

export function isToken(maybeToken: unknown): maybeToken is Token {
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

export function isCurrency(maybeCurrency: unknown): maybeCurrency is Currency {
  return Object.values(Currency).includes(maybeCurrency as Currency)
}
