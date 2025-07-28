import { isAddress } from 'viem'
import { HexData } from './HexData'

export type AddressValue = HexData

export function isAddressValue(value: unknown): value is AddressValue {
  return typeof value === 'string' && isAddress(value)
}
