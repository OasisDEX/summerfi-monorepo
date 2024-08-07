import { z } from 'zod'
import { IAddress, isAddress } from './IAddress'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @name IWallet
 * @description Interface for the implementors of the wallet
 *
 * This is present in the system in case it is needed to add extra information to the
 * wallet type
 */
export interface IWallet extends IWalletData {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /** Address of the wallet, valid for the different chains */
  readonly address: IAddress

  /**
   * @name equals
   * @description Checks if two wallets are equal
   * @param wallet The wallet to compare
   * @returns true if the wallets are equal
   *
   * Equality is determined by the address
   */
  equals(token: IWallet): boolean
}

/**
 * @description Zod schema for IWallet
 */
export const WalletDataSchema = z.object({
  address: z.custom<IAddress>((val) => isAddress(val)),
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
export function isWallet(maybeWallet: unknown): maybeWallet is IWallet {
  return WalletDataSchema.safeParse(maybeWallet).success
}
