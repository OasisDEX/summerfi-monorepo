import type { IChainInfo, IUser, SubgraphProviderType } from '@summerfi/sdk-common'
import { IManagerWithProviders } from '@summerfi/sdk-server-common'
import type { IArmadaSubgraphProvider } from './IArmadaSubgraphProvider'
import type { IArmadaPosition } from '@summerfi/armada-protocol-common'

/**
 * @name IArmadaSubgraphManager
 * @description interface for the Armada subgraph manager which will be distinct from the DPM subgraph manager
 */
export interface IArmadaSubgraphManager
  extends IManagerWithProviders<SubgraphProviderType, IArmadaSubgraphProvider> {
  getUserPositions(params: { chainInfo: IChainInfo; user: IUser }): Promise<IArmadaPosition[]>
}
