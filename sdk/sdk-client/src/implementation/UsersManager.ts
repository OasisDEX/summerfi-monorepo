import type { Address, ChainInfo } from '@summerfi/sdk-common/common'
import { IUsersManager } from '../interfaces/IUsersManager'
import { User } from './User'
import { RPCClientType } from '../rpc/SDKClient'
import { IRPCClient } from '../interfaces/IRPCClient'

export class UsersManager extends IRPCClient implements IUsersManager {
  constructor(params: { rpcClient: RPCClientType }) {
    super(params)
  }

  public async getUser(params: { chainInfo: ChainInfo; walletAddress: Address }): Promise<User> {
    return new User({
      ...params,
      rpcClient: this.rpcClient,
    })
  }
}
