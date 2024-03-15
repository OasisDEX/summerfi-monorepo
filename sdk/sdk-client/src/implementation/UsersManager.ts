import type { Address } from '@summerfi/sdk-common/common'
import { IUsersManager } from '../interfaces/IUsersManager'
import { Chain } from './Chain'
import { User } from './User'

export class UsersManager implements IUsersManager {
  public async getUser(params: { chain: Chain; walletAddress: Address }): Promise<User> {
    // TODO: Implement
    return new User({
      chainInfo: params.chain.chainInfo,
      walletAddress: params.walletAddress,
    })
  }
}
