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
  private readonly _subgraphConfig: SubgraphConfig

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
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

  getGlobalRebalances({ chainId }: Parameters<IArmadaSubgraphManager['getGlobalRebalances']>[0]) {
    return this._getClient(chainId).GetGlobalRebalances()
  }

  getUsersActivity({ chainId }: Parameters<IArmadaSubgraphManager['getUsersActivity']>[0]) {
    return this._getClient(chainId).GetUsersActivity()
  }

  getUserActivity({ chainId, vaultId }: Parameters<IArmadaSubgraphManager['getUserActivity']>[0]) {
    return this._getClient(chainId).GetUserActivity({ id: vaultId })
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
