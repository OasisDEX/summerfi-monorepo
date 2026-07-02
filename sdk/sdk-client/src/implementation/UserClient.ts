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

  /**
   * Returns the user's positions for a given protocol.
   *
   * @returns A promise resolving to the user's positions in that protocol.
   * @remarks Not yet implemented — currently returns an empty array.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositionsByProtocol(_params: { protocol: IProtocol }): Promise<Position[]> {
    // TODO: Implement
    return []
  }

  /**
   * Returns the user's positions matching the given position ids.
   *
   * @returns A promise resolving to the matching positions.
   * @remarks Not yet implemented — currently returns an empty array.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositionsByIds(_params: { positionIds: PositionId[] }): Promise<Position[]> {
    // TODO: Implement
    return []
  }

  /**
   * Returns a single position owned by the user, by its id.
   *
   * @param params - Parameters object.
   * @param params.id - The id of the position to return.
   * @returns A promise resolving to the position, or a nullish {@link Maybe} if not found.
   * @remarks Not yet implemented — currently returns a placeholder value.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPosition(params: { id: PositionId }): Promise<Maybe<Position>> {
    // TODO: Implement
    return {} as Position
  }

  // TODO: the positions manager should only be passed when generating DMA orders, which
  // TODO: breaks the flow for other simulations. Need to refactor this
  /**
   * Builds an executable order for this user from a simulation.
   *
   * @param params - Parameters object.
   * @param params.simulation - The simulation describing the desired position change.
   * @param params.positionsManager - Optional positions manager, required only for DMA orders.
   * @returns A promise resolving to the built order, or a nullish {@link Maybe} if none could be built.
   */
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
