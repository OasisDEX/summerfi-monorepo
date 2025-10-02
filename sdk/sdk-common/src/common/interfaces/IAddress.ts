import { isHex } from 'viem'
import { z } from 'zod'
import { AddressType } from '../enums/AddressType'
import type { AddressValue } from '../types/AddressValue'
import type { IPrintable } from './IPrintable'
import type { ISolidityValue } from './ISolidityValue'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @name IAddress
 * @description Represents an address with a certain format, specified by the type
 *
 * Currently only Ethereum type is supported
 */
export interface IAddress extends IAddressData, IPrintable, ISolidityValue<AddressValue> {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /** The address value in the format specified by type */
  readonly value: AddressValue
  /** The type of the address */
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
export const AddressDataSchema = z.object({
  value: z.custom<AddressValue>((val) => isHex(val)),
  type: z.nativeEnum(AddressType),
})

/**
 * Type for the data part of the IAddress interface
 */
export type IAddressData = Readonly<z.infer<typeof AddressDataSchema>>

/**
 * @description Type guard for IAddress
 * @param maybeAddress
 * @returns true if the object is an IAddress
 */
export function isAddress(
  maybeAddress: unknown,
  returnedErrors?: string[],
): maybeAddress is IAddress {
  const zodReturn = AddressDataSchema.safeParse(maybeAddress)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
