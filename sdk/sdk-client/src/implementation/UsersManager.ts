import { Wallet } from '@summerfi/sdk-common'
import type { Address, ChainInfo } from '@summerfi/sdk-common'
import { IRPCClient } from '../interfaces/IRPCClient'
import { IUsersManager } from '../interfaces/IUsersManager'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { UserClient } from './UserClient'

/**
 * Client-side implementation of {@link IUsersManager} that creates per-wallet {@link UserClient}
 * instances scoped to a chain.
 */
export class UsersManager extends IRPCClient implements IUsersManager {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /**
   * Creates a {@link UserClient} for a wallet on a specific chain.
   *
   * @param params - Parameters object.
   * @param params.chainInfo - The chain the user client should operate on.
   * @param params.walletAddress - The wallet address to scope the client to.
   * @returns A promise resolving to the wallet-scoped {@link UserClient}.
   */
  public async getUserClient(params: {
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
