import { ChainInfo, IChainInfo, Wallet } from '@summerfi/sdk-common/common'
import { IWallet } from '../../common/interfaces/IWallet'
import { SerializationService } from '../../services/SerializationService'
import { IUser, IUserData } from '../interfaces/IUser'

/**
 * @name User
 * @see IUser
 */
export class User implements IUser {
  public readonly wallet: IWallet
  public readonly chainInfo: IChainInfo

  public createFrom(params: IUserData): User {
    return new User(params)
  }

  protected constructor(params: IUserData) {
    this.chainInfo = ChainInfo.createFrom(params.chainInfo)
    this.wallet = Wallet.createFrom(params.wallet)
  }

  equals(token: IUser): boolean {
    return this.chainInfo.equals(token.chainInfo) && this.wallet.equals(token.wallet)
  }

  toString(): string {
    return `User: ${this.wallet} on ${this.chainInfo}`
  }
}

SerializationService.registerClass(User)
