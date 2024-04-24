import { AddressValue } from '../aliases/AddressValue'
import { AddressType } from '../enums/AddressType'
import { z } from 'zod'

/**
 * @name IAddress
 * @description Represents an address with a certain format, specified by the type
 *
 * Currently only Ethereum type is supported
 */
export interface IAddress {
  /** The address value in the format specified by type */
  value: AddressValue
  /** The type of the address */
  type: AddressType
}

/**
 * @description Type guard for IAddress
 * @param maybeAddress
 * @returns true if the object is an IAddress
 */
export function isAddress(maybeAddress: unknown): maybeAddress is IAddress {
  return (
    typeof maybeAddress === 'object' &&
    maybeAddress !== null &&
    'value' in maybeAddress &&
    'type' in maybeAddress
  )
}

/**
 * @description Zod schema for IAddress
 */
export const AddressSchema = z.object({
  value: z.custom<AddressValue>(),
  type: z.nativeEnum(AddressType),
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IAddress = {} as z.infer<typeof AddressSchema>
