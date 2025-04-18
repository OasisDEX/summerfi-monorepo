import { User, type IUser } from '@summerfi/sdk-common'
import {
  IChainInfo,
  IProtocol,
  IWallet,
  Maybe,
  Position,
  PositionId,
  IPositionsManager,
  Order,
  ISimulation,
  SerializationService,
} from '@summerfi/sdk-common'
import { IUserClient } from '../interfaces/IUserClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { IRPCClient } from '../interfaces/IRPCClient'

/**
 * @class UserClient
 * @see IUserClient
 */
export class UserClient extends IRPCClient implements IUserClient {
  user: IUser

  /** Constructor */
  public constructor(params: {
    rpcClient: RPCMainClientType
    chainInfo: IChainInfo
    wallet: IWallet
  }) {
    super({ rpcClient: params.rpcClient })

    this.user = User.createFrom({ wallet: params.wallet, chainInfo: params.chainInfo })
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

  // TODO: the positions manager should only be passed when generating DMA orders, which
  // TODO: breaks the flow for other simulations. Need to refactor this
  public async newOrder(params: {
    simulation: ISimulation
    positionsManager?: IPositionsManager
  }): Promise<Maybe<Order>> {
    return await this.rpcClient.orders.buildOrder.mutate({
      user: this.user,
      positionsManager: params.positionsManager,
      simulation: params.simulation,
    })
  }
}

SerializationService.registerClass(UserClient, { identifier: 'UserClient' })
