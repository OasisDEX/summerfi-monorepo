import { isAddress, Address } from 'viem'

/** A checksummed EVM address string (alias of viem's `Address`). */
export type AddressValue = Address

/**
 * Type guard that checks whether a value is a valid {@link AddressValue}.
 *
 * @param value - The value to test.
 * @returns `true` if the value is a string that parses as an EVM address.
 */
export function isAddressValue(value: unknown): value is AddressValue {
  return typeof value === 'string' && isAddress(value)
}
