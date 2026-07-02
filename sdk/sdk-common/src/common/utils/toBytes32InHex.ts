import { toHex, type Hex } from 'viem'

/**
 * Encodes a string as a right-padded 32-byte hex value (`bytes32`).
 *
 * @param value - The non-empty string to encode.
 * @returns The value as a 32-byte hex string.
 * @throws Error if `value` is empty.
 */
export function toBytes32InHex(value: string): Hex {
  if (!value) {
    throw new Error('Value is required to convert to bytes32')
  }
  return toHex(value, { size: 32 })
}
