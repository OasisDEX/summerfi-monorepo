import { Wallet } from '~sdk/common'
import { UsersManager, User } from '~sdk/users'
import { Chain } from '~sdk/chains'
import { UsersClientImpl } from './UserClientImpl'

export class UsersManagerClientImpl implements UsersManager {
  public async getUser(params: { chain: Chain; wallet: Wallet }): Promise<User> {
    // TODO: Implement
    return new UsersClientImpl({ chain: params.chain, wallet: params.wallet })
  }
}
