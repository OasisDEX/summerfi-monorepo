import type { Address, ChainInfo } from '@summerfi/sdk-common/common'
import { IUsersManager } from '../interfaces/IUsersManager'
import { User } from './User'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { IRPCClient } from '../interfaces/IRPCClient'

export class UsersManager extends IRPCClient implements IUsersManager {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  public async getUser(params: { chainInfo: ChainInfo; walletAddress: Address }): Promise<User> {
    return new User({
      ...params,
      rpcClient: this.rpcClient,
    })
  }
}
