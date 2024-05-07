import { TokenBalance } from '@summerfi/triggers-shared'

export function normalizeBalance(token: TokenBalance, targetDecimals: number): bigint {
  return token.balance * 10n ** BigInt(targetDecimals - token.token.decimals)
}

export function normalizeAmount(amount: bigint, fromDecimals: number, toDecimals: number): bigint {
  const exponent = BigInt(toDecimals - fromDecimals)
  if (exponent < 0) {
    return amount / 10n ** -exponent
  }
  return amount * 10n ** exponent
}

export function getTheLeastCommonMultiple(...values: number[]): number {
  const max = Math.max(...values)
  const min = Math.min(...values)
  let result = max
  while (result % min !== 0) {
    result += max
  }
  return result
}
