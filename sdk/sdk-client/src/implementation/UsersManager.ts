import type { Address } from '@summerfi/sdk-common/common'
import type { Chain } from '../implementation/Chain'
import { User } from '../implementation/User'
import type { IUser } from '../interfaces/IUser'
import type { IUsersManager } from '../interfaces/IUsersManager'

export class UsersManager implements IUsersManager {
  public async getUser(params: { chain: Chain; walletAddress: Address }): Promise<IUser> {
    // TODO: Implement
    return new User({ chainInfo: params.chain.chainInfo, walletAddress: params.walletAddress })
  }
}
