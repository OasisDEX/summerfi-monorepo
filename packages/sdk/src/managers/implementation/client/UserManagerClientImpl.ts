import { Wallet } from '~sdk/common'
import { UserManager } from '~sdk/managers'
import { Chain } from '~sdk/chain'
import { User } from '~sdk/user'

export class UserManagerClientImpl implements UserManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getUser(params: { chain: Chain; wallet: Wallet }): Promise<User> {
    // TODO: Implement
    return {} as User
  }
}
