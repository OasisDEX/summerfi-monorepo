import { Protocol } from '~sdk/protocols'
import { Position, PositionId } from './Position'
import { Order, Simulation } from '~sdk/orders'
import { Maybe } from '~sdk/utils'
import { Wallet } from '~sdk/common'
import { Chain } from '~sdk/chains'

/**
 * @interface User
 * @description Represents a user and allows to access their positions and to create new orders
 *
 * @dev This interface must be used to get positions for a user that will be used to create orders. To retrieve
 *      positions for portfolio please @see PortfolioManager
 */
export interface User {
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
  newOrder(params: { simulation: Simulation }): Promise<Order>
}
