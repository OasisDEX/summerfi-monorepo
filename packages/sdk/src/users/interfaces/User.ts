import { Protocol } from '~sdk/protocols'
import { Position, PositionId } from './Position'
import { Order, Simulation } from '~sdk/orders'
import { Maybe } from '~sdk/utils'

/**
 * @name UserId
 * @description Represents the ID of a user
 */
export type UserId = string

/**
 * @interface User
 * @description Represents a user and allows to access their positions and to create new orders
 *
 * @dev This interface must be used to get positions for a user that will be used to create orders. To retrieve
 *      positions for portfolio please @see PortfolioManager
 */
export interface User {
  /** The ID of the user */
  id: UserId

  /**
   * @method getPositionsByProtocol
   * @description Retrieves the list of positions of the user for a given protocol
   */
  getPositionsByProtocol(protocol: Protocol): Promise<Position[]>

  /**
   * @method getPositionsByIds
   * @description Retrieves the list of positions of the user for the given IDs
   */
  getPositionsByIds(positionIds: PositionId[]): Promise<Position[]>

  /**
   * @method getPosition
   * @description Retrieves a position of the user by its ID
   */
  getPosition(id: PositionId): Promise<Maybe<Position>>

  /**
   *
   */
  newOrder(simulation: Simulation): Promise<Order>
}
