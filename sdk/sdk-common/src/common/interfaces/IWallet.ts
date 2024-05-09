import { AddressDataSchema, IAddress } from './IAddress'
import { z } from 'zod'

/**
 * @name IWallet
 * @description Interface for the implementors of the wallet
 *
 * This is present in the system in case it is needed to add extra information to the
 * wallet type
 */
export interface IWallet extends IWalletData {
  /** Address of the wallet, valid for the different chains */
  readonly address: IAddress
}

/**
 * @description Zod schema for IWallet
 */
export const WalletDataSchema = z.object({
  address: AddressDataSchema,
})

/**
 * Type for the data part of the IWallet interface
 */
export type IWalletData = Readonly<z.infer<typeof WalletDataSchema>>

/**
 * @description Type guard for IWallet
 * @param maybeWallet
 * @returns true if the object is an IWallet
 */
export function isWallet(maybeWallet: unknown): maybeWallet is IWalletData {
  return WalletDataSchema.safeParse(maybeWallet).success
}
