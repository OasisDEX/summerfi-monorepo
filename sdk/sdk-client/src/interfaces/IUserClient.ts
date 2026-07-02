import {
  IProtocol,
  Maybe,
  Position,
  PositionId,
  Order,
  ISimulation,
  IUser,
} from '@summerfi/sdk-common'

/**
 * Represents a user and allows to access their positions and to create new orders
 *
 * @remarks This interface must be used to get positions for a user that will be used to create orders. To retrieve
 * positions for portfolio please @see PortfolioManager
 */
export interface IUserClient {
  user: IUser

  /**
   * Retrieves the list of positions of the user for a given protocol
   */
  getPositionsByProtocol(params: { protocol: IProtocol }): Promise<Position[]>

  /**
   * Retrieves the list of positions of the user for the given IDs
   */
  getPositionsByIds(params: { positionIds: PositionId[] }): Promise<Position[]>

  /**
   * Retrieves a position of the user by its ID
   */
  getPosition(params: { id: PositionId }): Promise<Maybe<Position>>

  /**
   * Creates a new order for the user based on the given simulation
   *
   * @param simulation The simulation to create the order for
   *
   * @returns The new order created for the user
   */
  newOrder(params: { simulation: ISimulation }): Promise<Maybe<Order>>
}
