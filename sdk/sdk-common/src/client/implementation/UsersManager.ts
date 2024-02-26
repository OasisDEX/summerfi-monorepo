import { Wallet } from '~sdk-common/common/implementation'
import { User, type Chain } from '~sdk-common/client/implementation'
import { type IUser } from '~sdk-common/client/interfaces/IUser'
import type { IUsersManager } from '~sdk-common/client/interfaces'

export class UsersManager implements IUsersManager {
  public async getUser(params: { chain: Chain; wallet: Wallet }): Promise<IUser> {
    // TODO: Implement
    return new User({ chain: params.chain, wallet: params.wallet })
  }
}
