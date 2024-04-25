import { AddressSchema, IAddress, IAddressData } from './IAddress'
import { z } from 'zod'

/**
 * @name IWalletData
 * @description Represents a wallet address
 *
 * This is present in the system in case it is needed to add extra information to the
 * wallet type
 */
export interface IWalletData {
  /** Wallet address */
  readonly address: IAddressData
}

/**
 * @name IWallet
 * @description Interface for the implementors of the wallet
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IWallet extends IWalletData {
  readonly address: IAddress
}

/**
 * @description Zod schema for IWallet
 */
export const WalletSchema = z.object({
  address: AddressSchema,
})

/**
 * @description Type guard for IWallet
 * @param maybeWallet
 * @returns true if the object is an IWallet
 */
export function isWallet(maybeWallet: unknown): maybeWallet is IWalletData {
  return WalletSchema.safeParse(maybeWallet).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IWalletData = {} as z.infer<typeof WalletSchema>
