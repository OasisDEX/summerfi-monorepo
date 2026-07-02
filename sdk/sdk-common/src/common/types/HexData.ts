import { isHex } from 'viem'

/** A `0x`-prefixed hexadecimal string (e.g. calldata or an encoded value). */
export type HexData = `0x${string}`

/**
 * Type guard that checks whether a value is valid {@link HexData}.
 *
 * @param value - The value to test.
 * @returns `true` if the value is a `0x`-prefixed hex string.
 */
export function isHexData(value: unknown): value is HexData {
  return typeof value === 'string' && isHex(value)
}
