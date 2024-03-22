import { TokenBalance } from '@summerfi/triggers-shared'

export function normalizeBalance(token: TokenBalance, targetDecimals: number): bigint {
  return token.balance * 10n ** BigInt(targetDecimals - token.token.decimals)
}

export function normalizeAmount(amount: bigint, fromDecimals: number, toDecimals: number): bigint {
  return amount * 10n ** BigInt(toDecimals - fromDecimals)
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
