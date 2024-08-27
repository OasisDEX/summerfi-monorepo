import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainFamilyMap, ChainId, SubgraphProviderType, TokenAmount } from '@summerfi/sdk-common'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import { IArmadaSubgraphProvider } from '@summerfi/subgraph-manager-common'
import { getUserPositions } from '@summerfi/summer-earn-protocol-subgraph'
import { ArmadaPosition, ArmadaPositionId } from '@summerfi/armada-protocol-service'

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

  getUserPositions({
    chainInfo,
    user,
  }: Parameters<IArmadaSubgraphProvider['getUserPositions']>[0]) {
    const userPositions = getUserPositions(
      { userAddress: user.wallet.address.value },
      this._getConfigForClient(chainInfo.chainId),
    )
    return userPositions.then((positions) => {
      console.log(`positions: `, positions)
      return positions.positions.map((position) => {
        console.log(`position: `, position)
        return ArmadaPosition.createFrom({
          id: ArmadaPositionId.createFrom({ id: position.id, user: user }),
          amount: TokenAmount.createFrom({
            amount: position.inputTokenBalance,
            token: position.inputToken,
          }),
        })
      })
    })
  }

  /** PRIVATE */
  _getConfigForClient(chainId: ChainId) {
    return {
      urlBase: this._subgraphConfig.urlBase,
      chainId,
    }
  }
}
