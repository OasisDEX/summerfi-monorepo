import { ChainInfo } from '../../common/implementation/ChainInfo'
import { Wallet } from '../../common/implementation/Wallet'
import { IChainInfo } from '../../common/interfaces/IChainInfo'
import { IWallet } from '../../common/interfaces/IWallet'
import { SerializationService } from '../../services/SerializationService'
import { IUser, IUserData, __signature__ } from '../interfaces/IUser'

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
  public createFrom(params: IUserData): User {
    return new User(params)
  }

  /** SEALED CONSTRUCTOR */
  protected constructor(params: IUserData) {
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
    this.wallet = Wallet.createFrom(params.wallet)
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

SerializationService.registerClass(User)
