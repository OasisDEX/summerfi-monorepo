import type { IArmadaPosition } from '@summerfi/armada-protocol-common'
import type { IChainInfo, IUser, SubgraphProviderType } from '@summerfi/sdk-common'
import { IManagerProvider } from '@summerfi/sdk-server-common'

/**
 * @name IArmadaSubgraphProvider
 * @description interface for the Armada subgraph provider
 */
export interface IArmadaSubgraphProvider extends IManagerProvider<SubgraphProviderType> {
  getUserPositions(params: { chainInfo: IChainInfo; user: IUser }): Promise<IArmadaPosition[]>
}
