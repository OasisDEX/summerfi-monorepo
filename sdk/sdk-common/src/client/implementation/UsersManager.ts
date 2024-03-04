import { Wallet } from '~sdk-common/common/implementation/Wallet'
import { type IUser } from '~sdk-common/client/interfaces/IUser'
import type { IUsersManager } from '~sdk-common/client/interfaces/IUsersManager'
import type { Chain } from '~sdk-common/client/implementation/Chain'
import { User } from '~sdk-common/client/implementation/User'

export class UsersManager implements IUsersManager {
  public async getUser(params: { chain: Chain; wallet: Wallet }): Promise<IUser> {
    // TODO: Implement
    return new User({ chain: params.chain, wallet: params.wallet })
  }
}
