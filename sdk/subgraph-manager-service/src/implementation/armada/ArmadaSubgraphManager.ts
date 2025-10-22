import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  IArmadaSubgraphManager,
  createProtocolGraphQLClient,
  createInstitutionsGraphQLClient,
} from '@summerfi/subgraph-manager-common'
import { type ChainId } from '@summerfi/sdk-common'

export const SubgraphTypes = {
  protocol: 'protocol',
  institutions: 'institutions',
} as const
export type SubgraphType = keyof typeof SubgraphTypes

export interface SubgraphConfig {
  protocolGraphUrl: Record<ChainId, string>
  institutionsGraphUrl: Record<ChainId, string>
}

/**
 * @name ArmadaSubgraphManager
 * @implements IArmadaSubgraphManager
 */
export class ArmadaSubgraphManager implements IArmadaSubgraphManager {
  private readonly _subgraphConfig: SubgraphConfig

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    let protocolGraphUrl, institutionsGraphUrl
    try {
      protocolGraphUrl = JSON.parse(
        params.configProvider.getConfigurationItem({ name: 'SDK_SUBGRAPH_CONFIG' }),
      )
    } catch (error: unknown) {
      throw new Error('Invalid format of SDK_SUBGRAPH_CONFIG')
    }
    try {
      institutionsGraphUrl = JSON.parse(
        params.configProvider.getConfigurationItem({ name: 'SDK_SUBGRAPH_CONFIG_INSTI' }),
      )
    } catch (error: unknown) {
      throw new Error('Invalid format of SDK_SUBGRAPH_CONFIG_INSTI')
    }

    if (!protocolGraphUrl) {
      throw new Error('No subgraph config in env')
    }
    if (!institutionsGraphUrl) {
      throw new Error('No institutions subgraph config in env')
    }

    this._subgraphConfig = {
      protocolGraphUrl: protocolGraphUrl,
      institutionsGraphUrl: institutionsGraphUrl,
    }
  }

  getVaults({ chainId }: Parameters<IArmadaSubgraphManager['getVaults']>[0]) {
    try {
      return this._getClient(SubgraphTypes.protocol, chainId).GetVaults()
    } catch (error) {
      console.error(
        'Error fetching vaults:',
        (error as { message: string } | undefined)?.message ?? error,
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return undefined as any
    }
  }

  getVault({ chainId, vaultId }: Parameters<IArmadaSubgraphManager['getVault']>[0]) {
    return this._getClient(SubgraphTypes.protocol, chainId).GetVault({
      id: vaultId,
    })
  }

  getGlobalRebalances({ chainId }: Parameters<IArmadaSubgraphManager['getGlobalRebalances']>[0]) {
    return this._getClient(SubgraphTypes.protocol, chainId).GetGlobalRebalances()
  }

  getUsersActivity({ chainId, where }: Parameters<IArmadaSubgraphManager['getUsersActivity']>[0]) {
    return this._getClient(SubgraphTypes.protocol, chainId).GetUsersActivity({ where })
  }

  getUserActivity({
    chainId,
    vaultId,
    accountAddress,
  }: Parameters<IArmadaSubgraphManager['getUserActivity']>[0]) {
    return this._getClient(SubgraphTypes.protocol, chainId).GetUserActivity({
      id: vaultId,
      accountId: accountAddress,
    })
  }

  getUserPositions({ user }: Parameters<IArmadaSubgraphManager['getUserPositions']>[0]) {
    return this._getClient(SubgraphTypes.protocol, user.chainInfo.chainId).GetUserPositions({
      accountAddress: user.wallet.address.toSolidityValue(),
    })
  }

  getUserPosition({
    user,
    fleetAddress,
  }: Parameters<IArmadaSubgraphManager['getUserPosition']>[0]) {
    return this._getClient(SubgraphTypes.protocol, user.chainInfo.chainId).GetUserPosition({
      accountAddress: user.wallet.address.toSolidityValue(),
      vaultId: fleetAddress.toSolidityValue(),
    })
  }

  getPosition(params: Parameters<IArmadaSubgraphManager['getPosition']>[0]) {
    return this._getClient(
      SubgraphTypes.protocol,
      params.positionId.user.chainInfo.chainId,
    ).GetPosition({
      id: params.positionId.id.toLowerCase(),
    })
  }

  getInstitutions(params: Parameters<IArmadaSubgraphManager['getInstitutions']>[0]) {
    return this._getClient(SubgraphTypes.institutions, params.chainId).GetInstitutions()
  }

  getInstitutionById(params: Parameters<IArmadaSubgraphManager['getInstitutionById']>[0]) {
    const id = params.id.toLowerCase()
    return this._getClient(SubgraphTypes.institutions, params.chainId).GetInstitutionById({
      id,
    })
  }

  /** PRIVATE */
  _getClient<T extends SubgraphType>(
    graph: T,
    chainId: ChainId,
  ): ReturnType<
    {
      [SubgraphTypes.protocol]: typeof createProtocolGraphQLClient
      [SubgraphTypes.institutions]: typeof createInstitutionsGraphQLClient
    }[T]
  > {
    const protocolSubgraphApiUrl = this._subgraphConfig.protocolGraphUrl[chainId]
    const institutionsSubgraphApiUrl = this._subgraphConfig.institutionsGraphUrl[chainId]

    if (!protocolSubgraphApiUrl) {
      throw new Error(`No protocol subgraph url found for chainId: ${chainId}`)
    }
    if (!institutionsSubgraphApiUrl) {
      throw new Error(`No institutions subgraph url found for chainId: ${chainId}`)
    }

    const client = {
      [SubgraphTypes.protocol]: createProtocolGraphQLClient(protocolSubgraphApiUrl),
      [SubgraphTypes.institutions]: createInstitutionsGraphQLClient(institutionsSubgraphApiUrl),
    }[graph]

    if (!client) {
      throw new Error(`Failed to create subgraph client for graph: ${graph}`)
    }

    return client as ReturnType<
      {
        [SubgraphTypes.protocol]: typeof createProtocolGraphQLClient
        [SubgraphTypes.institutions]: typeof createInstitutionsGraphQLClient
      }[T]
    >
  }
}
