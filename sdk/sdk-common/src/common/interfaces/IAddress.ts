import { AddressValue } from '../aliases/AddressValue'
import { AddressType } from '../enums/AddressType'
import { z } from 'zod'

/**
 * @name IAddressData
 * @description Represents an address with a certain format, specified by the type
 *
 * Currently only Ethereum type is supported
 */
export interface IAddressData {
  /** The address value in the format specified by type */
  value: AddressValue
  /** The type of the address */
  type: AddressType
}

/**
 * @name IAddress
 * @description Interface for the implementors of the address
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IAddress extends IAddressData {
  readonly value: AddressValue
  readonly type: AddressType

  /**
   * @name equals
   * @description Checks if two addresses are equal
   * @param address The address to compare
   * @returns true if the addresses are equal
   *
   * Equality is determined by the address value and type
   */
  equals(address: IAddress): boolean
}

/**
 * @description Zod schema for IAddress
 */
export const AddressSchema = z.object({
  value: z.custom<AddressValue>(),
  type: z.nativeEnum(AddressType),
})

/**
 * @description Type guard for IAddress
 * @param maybeAddress
 * @returns true if the object is an IAddress
 */
export function isAddress(maybeAddress: unknown): maybeAddress is IAddressData {
  return AddressSchema.safeParse(maybeAddress).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAddressData = {} as z.infer<typeof AddressSchema>
