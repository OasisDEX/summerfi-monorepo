import type { Token } from '~sdk-common/common/implementation/Token'

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
