import { Wallet } from '~sdk-common/common'
import { type IUsersManager, User, type Chain } from '~sdk-common/client'
import { type IUser } from '~sdk-common/client/interfaces/IUser'

export class UsersManager implements IUsersManager {
  public async getUser(params: { chain: Chain; wallet: Wallet }): Promise<IUser> {
    // TODO: Implement
    return new User({ chain: params.chain, wallet: params.wallet })
  }
}
