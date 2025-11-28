import { isHex } from 'viem'

export type HexData = `0x${string}`

export function isHexData(value: unknown): value is HexData {
  return typeof value === 'string' && isHex(value)
}
