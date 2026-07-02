import type { AddressValue } from '../types/AddressValue'

/** Lowercased sentinel address (`0xEee…eEeE`) conventionally used to represent a chain's native currency. */
export const NATIVE_CURRENCY_ADDRESS_LOWERCASE =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() as AddressValue
