import { CurrencySymbol, Token } from '~sdk-common/common'

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

export function isCurrency(maybeCurrency: unknown): maybeCurrency is CurrencySymbol {
  return Object.values(CurrencySymbol).includes(maybeCurrency as CurrencySymbol)
}
