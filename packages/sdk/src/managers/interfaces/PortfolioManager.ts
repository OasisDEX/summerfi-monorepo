import { Wallet } from '~sdk/common'
import { NetworkId } from '~sdk/network'
import { Position, PositionId } from '~sdk/user'

/**
 * @interface PortfolioManager
 * @description Allows to retrieve a wallet's positions by their wallet and network. This is meant to be used in isolation
 *              without having to retrieve a User or a Network
 */
export interface PortfolioManager {
  /**
   * @method getPositions
   * @description Retrieves all positions of the given wallet for the given networks. The positions can be filtered by
   *              their IDs
   *
   * @param networks The list of networks to retrieve the positions for
   * @param wallet The wallet to retrieve the positions for
   * @param ids The list of IDs to filter the positions by (optional)
   *
   * @returns The list of positions for the given wallet and networks
   */
  getPositions(params: { networks: NetworkId[]; wallet: Wallet; ids?: PositionId[] }): Position[]
}
