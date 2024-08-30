import type { IUser, SubgraphProviderType } from '@summerfi/sdk-common'
import { IManagerWithProviders } from '@summerfi/sdk-server-common'
import type { PositionsByAddressQuery } from '../generated/client'
import type { IArmadaSubgraphProvider } from './IArmadaSubgraphProvider'

/**
 * @name IArmadaSubgraphManager
 * @description interface for the Armada subgraph manager which will be distinct from the DPM subgraph manager
 */
export interface IArmadaSubgraphManager
  extends IManagerWithProviders<SubgraphProviderType, IArmadaSubgraphProvider> {
  getUserPositions(params: { user: IUser }): Promise<PositionsByAddressQuery>
}
