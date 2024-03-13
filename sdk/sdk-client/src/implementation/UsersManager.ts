import type { Address } from '@summerfi/sdk-common/common'
import type { Chain } from '~sdk-client/implementation/Chain'
import { User } from '~sdk-client/implementation/User'
import type { IUser } from '~sdk-client/interfaces/IUser'
import type { IUsersManager } from '~sdk-client/interfaces/IUsersManager'

export class UsersManager implements IUsersManager {
  public async getUser(params: { chain: Chain; walletAddress: Address }): Promise<IUser> {
    // TODO: Implement
    return new User({ chainInfo: params.chain.chainInfo, walletAddress: params.walletAddress })
  }
}
