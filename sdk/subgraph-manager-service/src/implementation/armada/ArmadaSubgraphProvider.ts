import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  Address,
  ChainFamilyMap,
  ChainId,
  SubgraphProviderType,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import { IArmadaSubgraphProvider } from '@summerfi/subgraph-manager-common'
import {
  ArmadaPool,
  ArmadaPoolId,
  ArmadaPosition,
  ArmadaPositionId,
  ArmadaProtocol,
} from '@summerfi/armada-protocol-service'
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

  getUserPositions({
    chainInfo,
    user,
  }: Parameters<IArmadaSubgraphProvider['getUserPositions']>[0]) {
    const userPositions = this._getClient(chainInfo.chainId).PositionsByAddress({
      accountAddress: user.wallet.address.value,
    })
    return userPositions.then((positions) => {
      console.log(`positions: `, positions)
      return positions.positions.map((position) => {
        if (position.vault.outputToken == null) {
          throw new Error('outputToken is null on position' + JSON.stringify(position.id))
        }

        return ArmadaPosition.createFrom({
          id: ArmadaPositionId.createFrom({ id: position.id, user: user }),

          pool: ArmadaPool.createFrom({
            id: ArmadaPoolId.createFrom({
              chainInfo,
              fleetAddress: Address.createFromEthereum({
                value: position.vault.id,
              }),
              protocol: ArmadaProtocol.createFrom({ chainInfo }),
            }),
          }),
          amount: TokenAmount.createFrom({
            amount: position.inputTokenBalance.toString(),
            token: Token.createFrom({
              chainInfo,
              address: Address.createFromEthereum({
                value: position.vault.inputToken.id,
              }),
              name: position.vault.inputToken.name,
              symbol: position.vault.inputToken.symbol,
              decimals: position.vault.inputToken.decimals,
            }),
          }),
          shares: TokenAmount.createFrom({
            amount: position.outputTokenBalance.toString(),
            token: Token.createFrom({
              chainInfo,
              address: Address.createFromEthereum({
                value: position.vault.outputToken.id,
              }),
              name: position.vault.outputToken.name,
              symbol: position.vault.outputToken.symbol,
              decimals: position.vault.outputToken.decimals,
            }),
          }),
        })
      })
    })
  }

  /** PRIVATE */
  _getClient(chainId: ChainId) {
    return createGraphQLClient(chainId, this._subgraphConfig.urlBase)
  }
}
