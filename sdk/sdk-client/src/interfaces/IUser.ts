import { Maybe, Position, PositionId, Wallet } from '@summerfi/sdk-common/common'
import { Chain } from '../implementation/Chain'
import { Protocol } from '@summerfi/sdk-common/protocols'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { Order } from '@summerfi/sdk-common/orders'

/**
 * @interface IUser
 * @description Represents a user and allows to access their positions and to create new orders
 *
 * @dev This interface must be used to get positions for a user that will be used to create orders. To retrieve
 *      positions for portfolio please @see PortfolioManager
 */
export interface IUser {
  wallet: Wallet
  chain: Chain

  /**
   * @method getPositionsByProtocol
   * @description Retrieves the list of positions of the user for a given protocol
   */
  getPositionsByProtocol(params: { protocol: Protocol }): Promise<Position[]>

  /**
   * @method getPositionsByIds
   * @description Retrieves the list of positions of the user for the given IDs
   */
  getPositionsByIds(params: { positionIds: PositionId[] }): Promise<Position[]>

  /**
   * @method getPosition
   * @description Retrieves a position of the user by its ID
   */
  getPosition(params: { id: PositionId }): Promise<Maybe<Position>>

  /**
   * @method newOrder
   * @description Creates a new order for the user based on the given simulation
   *
   * @param simulation The simulation to create the order for
   *
   * @returns The new order created for the user
   */
  newOrder(params: { simulation: Simulation<SimulationType> }): Promise<Order>
}
