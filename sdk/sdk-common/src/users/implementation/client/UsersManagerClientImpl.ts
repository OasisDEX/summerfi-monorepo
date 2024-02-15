import { Wallet } from '~sdk-common/common'
import { UsersManager, User } from '~sdk-common/users'
import { Chain } from '~sdk-common/chains'
import { UsersClientImpl } from './UserClientImpl'

export class UsersManagerClientImpl implements UsersManager {
  public async getUser(params: { chain: Chain; wallet: Wallet }): Promise<User> {
    // TODO: Implement
    return new UsersClientImpl({ chain: params.chain, wallet: params.wallet })
  }
}
