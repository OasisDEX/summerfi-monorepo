import { Address } from '../../common/implementation/Address'
import { IUser } from '../interfaces/IUser'
import { IUsersManager } from '../interfaces/IUsersManager'
import { Chain } from './Chain'
import { User } from './User'

export class UsersManager implements IUsersManager {
  public async getUser(params: { chain: Chain; walletAddress: Address }): Promise<IUser> {
    // TODO: Implement
    return new User({ chain: params.chain, walletAddress: params.walletAddress })
  }
}
