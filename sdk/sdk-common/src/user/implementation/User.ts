import { IChainInfo } from '../../common/interfaces/IChainInfo'
import { IWallet } from '../../common/interfaces/IWallet'
import { SerializationService } from '../../services/SerializationService'
import { IUser, IUserData, __signature__ } from '../interfaces/IUser'

/**
 * Type for the parameters of User
 */
export type UserParameters = Omit<IUserData, ''>

/**
 * @name User
 * @see IUser
 */
export class User implements IUser {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  public readonly wallet: IWallet
  public readonly chainInfo: IChainInfo

  /** FACTORY */
  public static createFrom(params: UserParameters): User {
    return new User(params)
  }

  /** SEALED CONSTRUCTOR */
  protected constructor(params: UserParameters) {
    this.chainInfo = params.chainInfo
    this.wallet = params.wallet
  }

  /** METHODS */

  /** @see IUser.equals */
  equals(token: IUser): boolean {
    return this.chainInfo.equals(token.chainInfo) && this.wallet.equals(token.wallet)
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `User: ${this.wallet} on ${this.chainInfo}`
  }
}

SerializationService.registerClass(User, { identifier: 'User' })
