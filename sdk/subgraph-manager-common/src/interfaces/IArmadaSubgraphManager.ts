import type { IUser } from '@summerfi/sdk-common'
import type { PositionsByAddressQuery } from '../generated/client'

/**
 * @name IArmadaSubgraphManager
 * @description interface for the Armada subgraph manager which will be distinct from the DPM subgraph manager
 */
export interface IArmadaSubgraphManager {
  getUserPositions(params: { user: IUser }): Promise<PositionsByAddressQuery>
}
