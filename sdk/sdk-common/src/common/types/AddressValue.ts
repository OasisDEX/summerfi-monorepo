import { isAddress, Address } from 'viem'

export type AddressValue = Address

export function isAddressValue(value: unknown): value is AddressValue {
  return typeof value === 'string' && isAddress(value)
}
