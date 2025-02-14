import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IArmadaSubgraphManager, createGraphQLClient } from '@summerfi/subgraph-manager-common'
import { type ChainId } from '@summerfi/sdk-common'

export interface SubgraphConfig {
  urlPerChain: Record<ChainId, string>
}

/**
 * @name ArmadaSubgraphManager
 * @implements IArmadaSubgraphManager
 */
export class ArmadaSubgraphManager implements IArmadaSubgraphManager {
  private readonly _subgraphConfig: SubgraphConfig

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    let urlPerChain
    try {
      urlPerChain = JSON.parse(
        params.configProvider.getConfigurationItem({ name: 'SDK_SUBGRAPH_CONFIG' }),
      )
    } catch (error: unknown) {
      throw new Error('Invalid format of SDK_SUBGRAPH_CONFIG')
    }

    if (!urlPerChain) {
      throw new Error('No subgraph config in env')
    }

    this._subgraphConfig = {
      urlPerChain,
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

  getGlobalRebalances({
    chainId,
    first,
    skip,
    orderBy,
    orderDirection,
  }: Parameters<IArmadaSubgraphManager['getGlobalRebalances']>[0]) {
    return this._getClient(chainId).GetGlobalRebalances({
      first,
      skip,
      orderBy,
      orderDirection,
    })
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
    const subgraphApiUrl = this._subgraphConfig.urlPerChain[chainId]

    if (!this._subgraphConfig.urlPerChain[chainId]) {
      throw new Error(
        `Chain ID ${chainId} is not supported. Supported chains are: ${Object.keys(this._subgraphConfig.urlPerChain).join(', ')}`,
      )
    }

    if (!subgraphApiUrl) {
      throw new Error(`No subgraph url found for chainId: ${chainId}`)
    }

    return createGraphQLClient(subgraphApiUrl)
  }
}
