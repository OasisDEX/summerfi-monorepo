// stringified solidity bigint value
export type AmountValue = string

// Type guard for stringified solidity bigint value
export function isAmountValue(value: unknown): value is AmountValue {
  if (typeof value !== 'string') return false
  try {
    BigInt(value)
    return true
  } catch {
    return false
  }
}
