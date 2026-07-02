/** A Solidity `uint`/`int` amount represented as a decimal string. */
export type AmountValue = string

/**
 * Type guard that checks whether a value is a valid {@link AmountValue}.
 *
 * @param value - The value to test.
 * @returns `true` if the value is a string parseable as a `BigInt`.
 */
export function isAmountValue(value: unknown): value is AmountValue {
  if (typeof value !== 'string') return false
  try {
    BigInt(value)
    return true
  } catch {
    return false
  }
}
