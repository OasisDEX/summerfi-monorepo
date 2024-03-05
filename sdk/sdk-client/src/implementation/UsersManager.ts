import type { Wallet } from '@summerfi/sdk-common/common'
import type { Chain } from '~sdk-client/implementation/Chain'
import { User } from '~sdk-client/implementation/User'
import type { IUser } from '~sdk-client/interfaces/IUser'
import type { IUsersManager } from '~sdk-client/interfaces/IUsersManager'

export class UsersManager implements IUsersManager {
  public async getUser(params: { chain: Chain; wallet: Wallet }): Promise<IUser> {
    // TODO: Implement
    return new User({ chain: params.chain, wallet: params.wallet })
  }
}
