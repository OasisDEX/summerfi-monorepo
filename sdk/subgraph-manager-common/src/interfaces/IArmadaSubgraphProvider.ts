import type { IUser, SubgraphProviderType } from '@summerfi/sdk-common'
import { IManagerProvider } from '@summerfi/sdk-server-common'
import type { PositionsByAddressQuery } from '../generated/client'

/**
 * @name IArmadaSubgraphProvider
 * @description interface for the Armada subgraph provider
 */
export interface IArmadaSubgraphProvider extends IManagerProvider<SubgraphProviderType> {
  getUserPositions(params: { user: IUser }): Promise<PositionsByAddressQuery>
}
