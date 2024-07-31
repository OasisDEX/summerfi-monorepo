import { Wallet } from '@summerfi/sdk-common'
import type { Address, ChainInfo } from '@summerfi/sdk-common/common'
import { IRPCClient } from '../interfaces/IRPCClient'
import { IUsersManager } from '../interfaces/IUsersManager'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { UserClient } from './UserClient'

export class UsersManager extends IRPCClient implements IUsersManager {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  public async getUser(params: {
    chainInfo: ChainInfo
    walletAddress: Address
  }): Promise<UserClient> {
    return new UserClient({
      chainInfo: params.chainInfo,
      wallet: Wallet.createFrom({
        address: params.walletAddress,
      }),
      rpcClient: this.rpcClient,
    })
  }
}
