import type { IAddress, IUser } from '@summerfi/sdk-common'
import type { GetUserPositionQuery, GetUserPositionsQuery } from '../generated/client'

/**
 * @name IArmadaSubgraphManager
 * @description interface for the Armada subgraph manager which will be distinct from the DPM subgraph manager
 */
export interface IArmadaSubgraphManager {
  /**
   * @name getUserPositions
   * @description get the positions of a user
   *
   * @param user target user
   *
   * @returns GetUserPositionsQuery
   *
   * @throws Error
   *
   */
  getUserPositions(params: { user: IUser }): Promise<GetUserPositionsQuery>
  /**
   * @name getUserPosition
   * @description get the position of a user in a fleet
   *
   * @param user target user
   * @param fleetAddress Address of the fleet
   *
   * @returns GetUserPositionQuery
   *
   * @throws Error
   *
   */
  getUserPosition(params: { user: IUser; fleetAddress: IAddress }): Promise<GetUserPositionQuery>
}