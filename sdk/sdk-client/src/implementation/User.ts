import {
  Address,
  ChainInfo,
  Maybe,
  Position,
  PositionId,
  Wallet,
} from '@summerfi/sdk-common/common'
import { IPositionsManager, Order } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUserClient } from '../interfaces/IUserClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { IProtocol } from '@summerfi/sdk-common/protocols'

export class User extends IRPCClient implements IUserClient {
  public readonly wallet: Wallet
  public readonly chainInfo: ChainInfo

  public constructor(params: {
    rpcClient: RPCMainClientType
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
    return {} as Position
  }

  public async newOrder(params: {
    positionsManager: IPositionsManager
    simulation: ISimulation<SimulationType>
  }): Promise<Maybe<Order>> {
    return await this.rpcClient.orders.buildOrder.mutate({
      user: {
        wallet: this.wallet,
        chainInfo: this.chainInfo,
      },
      positionsManager: params.positionsManager,
      simulation: params.simulation,
    })
  }
}
