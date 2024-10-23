import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IArmadaSubgraphManager, createGraphQLClient } from '@summerfi/subgraph-manager-common'
import { type ChainId } from '@summerfi/sdk-common'

export interface SubgraphConfig {
  urlBase: string
}

/**
 * @name ArmadaSubgraphManager
 * @implements IArmadaSubgraphManager
 */
export class ArmadaSubgraphManager implements IArmadaSubgraphManager {
  private _configProvider: IConfigurationProvider
  private readonly _subgraphConfig: SubgraphConfig

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider
    const urlBase = params.configProvider.getConfigurationItem({ name: 'SUBGRAPH_BASE' })

    this._subgraphConfig = {
      urlBase,
    }
  }

  getVaults({ chainId }: Parameters<IArmadaSubgraphManager['getVaults']>[0]) {
    return this._getClient(chainId).GetVaults()
  }

  getVault({ chainId, vaultId }: Parameters<IArmadaSubgraphManager['getVault']>[0]) {
    return this._getClient(chainId).GetVault({
      id: vaultId,
    })
  }

  getUserPositions({ user }: Parameters<IArmadaSubgraphManager['getUserPositions']>[0]) {
    return this._getClient(user.chainInfo.chainId).GetUserPositions({
      accountAddress: user.wallet.address.value,
    })
  }

  getUserPosition({
    user,
    fleetAddress,
  }: Parameters<IArmadaSubgraphManager['getUserPosition']>[0]) {
    return this._getClient(user.chainInfo.chainId).GetUserPosition({
      accountAddress: user.wallet.address.value,
      vaultId: fleetAddress.value as string,
    })
  }

  /** PRIVATE */
  _getClient(chainId: ChainId): ReturnType<typeof createGraphQLClient> {
    return createGraphQLClient(chainId, this._subgraphConfig.urlBase)
  }
}
