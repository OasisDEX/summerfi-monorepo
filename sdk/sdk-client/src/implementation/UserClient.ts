import { User } from '@summerfi/sdk-common'
import { IChainInfo, IWallet, Maybe, Position, PositionId } from '@summerfi/sdk-common/common'
import { IPositionsManager, Order } from '@summerfi/sdk-common/orders'
import { IProtocol } from '@summerfi/sdk-common/protocols'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUserClient } from '../interfaces/IUserClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

/**
 * @class UserClient
 * @see IUserClient
 */
export class UserClient extends User implements IUserClient {
  private rpcClient: RPCMainClientType

  /** Constructor */
  public constructor(params: {
    rpcClient: RPCMainClientType
    chainInfo: IChainInfo
    wallet: IWallet
  }) {
    super(params)

    this.rpcClient = params.rpcClient
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
