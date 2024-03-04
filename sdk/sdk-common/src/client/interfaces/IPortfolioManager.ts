import type { ChainInfo } from '~sdk-common/common/implementation/ChainInfo'
import type { Position } from '~sdk-common/common/implementation/Position'
import type { Wallet } from '~sdk-common/common/implementation/Wallet'

/**
 * @interface IPortfolioManager
 * @description Allows to retrieve a wallet's positions by their wallet and network. This is meant to be used in isolation
 *              without having to retrieve a User or a Network
 */
export interface IPortfolioManager {
  /**
   * @method getPositions
   * @description Retrieves all positions of the given wallet for the given networks. The positions can be filtered by
   *              their IDs
   *
   * @param networks The list of networks to retrieve the positions for
   * @param wallet The wallet to retrieve the positions for
   *
   * @returns The list of positions for the given wallet and networks
   */
  getPositions(params: { networks: ChainInfo[]; wallet: Wallet }): Promise<Position[]>
}
