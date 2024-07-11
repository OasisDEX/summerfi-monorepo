import { z } from 'zod'
import { IPrintable } from '../../common'
import { ChainInfoDataSchema, IChainInfo } from '../../common/interfaces/IChainInfo'
import { IWallet, WalletDataSchema } from '../../common/interfaces/IWallet'

/**
 * Represents a user of the system connected with a wallet on a particular chain
 */
export interface IUser extends IUserData, IPrintable {
  /** The wallet of the user */
  readonly wallet: IWallet
  /** The chain the user is connected to */
  readonly chainInfo: IChainInfo
}

/**
 * Zod schema for the data part of IUser
 */
export const UserDataSchema = z.object({
  wallet: WalletDataSchema,
  chainInfo: ChainInfoDataSchema,
})

/**
 * Type for the data part of the IUser interface
 */
export type IUserData = Readonly<z.infer<typeof UserDataSchema>>

/**
 * Type guard for IUser
 * @param maybeUser Object to be checked
 * @returns true if the object is an IUser
 */
export function isUser(maybeUser: unknown, returnedErrors?: string[]): maybeUser is IUser {
  const zodReturn = UserDataSchema.safeParse(maybeUser)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}
