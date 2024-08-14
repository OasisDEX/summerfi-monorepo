import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  ChainFamilyMap,
  ChainId,
  SubgraphProviderType,
  type Address,
  type ChainInfo,
} from '@summerfi/sdk-common'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import { ISubgraphProvider } from '@summerfi/subgraph-common'
import { getUserPositions, getVaultDetails } from '@summerfi/summer-earn-protocol-subgraph'

export interface SubgraphConfig {
  urlBase: string
}

export class ArmadaSubgraphProvider
  extends ManagerProviderBase<SubgraphProviderType>
  implements ISubgraphProvider
{
  private readonly _subgraphConfig: SubgraphConfig
  private readonly _supportedChainIds: ChainId[]

  /** CONSTRUCTOR */

  constructor(params: { configProvider: IConfigurationProvider }) {
    super({ ...params, type: SubgraphProviderType.Armada })

    const baseChainId = ChainFamilyMap.Base.Mainnet.chainId
    this._supportedChainIds = [baseChainId]

    this._subgraphConfig = {
      // TODO: use config provider env to get this value
      urlBase: 'https://api.thegraph.com/subgraphs/name',
    }
  }

  /** PUBLIC */

  /** @see IManagerProvider.getSupportedChainIds */
  getSupportedChainIds(): ChainId[] {
    return this._supportedChainIds
  }

  getUserPositions({ chainInfo, userAddress }: { chainInfo: ChainInfo; userAddress: Address }) {
    return getUserPositions(
      { userAddress: userAddress.value },
      this._getConfigForClient(chainInfo.chainId),
    )
  }

  // TODO: do we want to create a common type for vaultId?
  getVaultDetails({ chainInfo, vaultId }: { chainInfo: ChainInfo; vaultId: string }) {
    return getVaultDetails({ vaultId }, this._getConfigForClient(chainInfo.chainId))
  }

  /** PRIVATE */
  _getConfigForClient(chainId: ChainId) {
    return {
      urlBase: this._subgraphConfig.urlBase,
      chainId,
    }
  }
}
