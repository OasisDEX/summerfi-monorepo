import { Wallet } from '~sdk/common'
import { UsersManager, User } from '~sdk/users'
import { Chain } from '~sdk/chains'

export class UsersManagerClientImpl implements UsersManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getUser(params: { chain: Chain; wallet: Wallet }): Promise<User> {
    // TODO: Implement
    return {} as User
  }
}
