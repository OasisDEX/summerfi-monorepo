import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainFamilyMap, ChainId, SubgraphProviderType } from '@summerfi/sdk-common'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import { IArmadaSubgraphProvider } from '@summerfi/subgraph-manager-common'
import { createGraphQLClient } from '../../utils/createGraphQLClient'

export interface SubgraphConfig {
  urlBase: string
}

export class ArmadaSubgraphProvider
  extends ManagerProviderBase<SubgraphProviderType>
  implements IArmadaSubgraphProvider
{
  private readonly _subgraphConfig: SubgraphConfig
  private readonly _supportedChainIds: ChainId[]

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: SubgraphProviderType.Armada })

    const baseChainId = ChainFamilyMap.Base.Base.chainId
    this._supportedChainIds = [baseChainId]

    const urlBase = params.configProvider.getConfigurationItem({ name: 'SUBGRAPH_BASE' })
    if (!urlBase) {
      throw new Error('Missing required configuration item: SUBGRAPH_BASE')
    }
    this._subgraphConfig = {
      urlBase,
    }
  }

  /** PUBLIC */

  /** @see IManagerProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return this._supportedChainIds
  }

  getUserPositions({ user }: Parameters<IArmadaSubgraphProvider['getUserPositions']>[0]) {
    return this._getClient(user.chainInfo.chainId).PositionsByAddress({
      accountAddress: user.wallet.address.value,
    })
  }

  /** PRIVATE */
  _getClient(chainId: ChainId) {
    return createGraphQLClient(chainId, this._subgraphConfig.urlBase)
  }
}
