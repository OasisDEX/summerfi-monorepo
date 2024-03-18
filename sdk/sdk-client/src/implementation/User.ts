import {
  Address,
  ChainInfo,
  Maybe,
  Position,
  PositionId,
  Wallet,
} from '@summerfi/sdk-common/common'
import { getMockPosition } from '../mocks/mockPosition'
import { IPositionsManager, Order } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUserClient } from '../interfaces/IUserClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCClientType } from '../rpc/SDKClient'
import { IProtocol } from '@summerfi/sdk-common/protocols'

export class User extends IRPCClient implements IUserClient {
  public readonly wallet: Wallet
  public readonly chainInfo: ChainInfo

  public constructor(params: {
    rpcClient: RPCClientType
    chainInfo: ChainInfo
    walletAddress: Address
  }) {
    super(params)

    this.chainInfo = params.chainInfo
    this.wallet = Wallet.createFrom({ address: params.walletAddress })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositionsByProtocol(_params: { protocol: IProtocol }): Promise<Position[]> {
    // TODO: Implement
    return []
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositionsByIds(_params: { positionIds: PositionId[] }): Promise<Position[]> {
    // TODO: Implement
    return []
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPosition(params: { id: PositionId }): Promise<Maybe<Position>> {
    // TODO: Implement
    // for client impl we'll use communication layer client
    // to get the position from the network
    // but for server we'll use a communication layer caller
    return getMockPosition({ chainInfo: this.chainInfo, wallet: this.wallet, id: params.id })
  }

  public async newOrder(params: {
    positionsManager: IPositionsManager
    simulation: Simulation<SimulationType>
  }): Promise<Maybe<Order>> {
    return await this.rpcClient.orders.buildOrder.query({
      user: this,
      ...params,
    })
  }
}
