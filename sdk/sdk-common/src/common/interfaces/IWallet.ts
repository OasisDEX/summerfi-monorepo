import { AddressSchema, IAddress, isAddress } from './IAddress'
import { z } from 'zod'

/**
 * @name IWallet
 * @description Represents a wallet address
 *
 * This is present in the system in case it is needed to add extra information to the
 * wallet type
 */
export interface IWallet {
  address: IAddress
}

/**
 * @description Type guard for IWallet
 * @param maybeWallet
 * @returns true if the object is an IWallet
 */
export function isWallet(maybeWallet: unknown): maybeWallet is IWallet {
  return (
    typeof maybeWallet === 'object' &&
    maybeWallet !== null &&
    'address' in maybeWallet &&
    isAddress(maybeWallet.address)
  )
}

/**
 * @description Zod schema for IWallet
 */
export const WalletSchema = z.object({
  address: AddressSchema,
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IWallet = {} as z.infer<typeof WalletSchema>
