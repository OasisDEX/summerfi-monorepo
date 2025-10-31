import { toHex, type Hex } from 'viem'

export function toBytes32InHex(value: string): Hex {
  if (!value) {
    throw new Error('Value is required to convert to bytes32')
  }
  return toHex(value, { size: 32 })
}
