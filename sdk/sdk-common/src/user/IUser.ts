import { ChainInfoDataSchema, IChainInfo } from '../common/interfaces/IChainInfo'
import { IWallet, WalletDataSchema } from '../common/interfaces/IWallet'
import { z } from 'zod'

/**
 * Represents a user of the system connected with a wallet on a particular chain
 */
export interface IUser extends IUserData {
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
export function isUser(maybeUser: unknown): maybeUser is IUser {
  return UserDataSchema.safeParse(maybeUser).success
}
