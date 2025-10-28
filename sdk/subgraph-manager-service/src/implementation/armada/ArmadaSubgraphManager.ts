import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  IArmadaSubgraphManager,
  createProtocolGraphQLClient,
  createInstitutionsGraphQLClient,
} from '@summerfi/subgraph-manager-common'
import { LoggingService, type ChainId } from '@summerfi/sdk-common'
import { toHex } from 'viem'

export const SubgraphTypes = {
  protocol: 'protocol',
  institutions: 'institutions',
} as const
export type SubgraphType = keyof typeof SubgraphTypes

/**
 * @name ArmadaSubgraphManager
 * @implements IArmadaSubgraphManager
 */
export class ArmadaSubgraphManager implements IArmadaSubgraphManager {
  private readonly _isAdminSdk: boolean
  private readonly _urlMap: Record<
    ChainId,
    {
      protocol: string
      institutions?: string
    }
  >

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider; isAdminSdk?: boolean }) {
    this._isAdminSdk = params.isAdminSdk ?? false

    const envName = this._isAdminSdk ? 'SDK_SUBGRAPH_CONFIG_INSTI' : 'SDK_SUBGRAPH_CONFIG'
    let urlMap
    try {
      urlMap = JSON.parse(params.configProvider.getConfigurationItem({ name: envName }))
    } catch (error: unknown) {
      throw new Error(`Invalid format of env ${envName} for sdk subgraph config`)
    }
    if (!urlMap) {
      throw new Error('No subgraph config in env')
    }
    LoggingService.log(`Loaded subgraph config from env ${envName}: ${JSON.stringify(urlMap)}`)

    this._urlMap = urlMap
  }

  getVaults({ chainId }: Parameters<IArmadaSubgraphManager['getVaults']>[0]) {
    try {
      return this._getClient(this._getSubgraphTypeByIsAdminSdk(), chainId).GetVaults()
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
    return this._getClient(this._getSubgraphTypeByIsAdminSdk(), chainId).GetVault({
      id: vaultId,
    })
  }

  getUserPositions({ user }: Parameters<IArmadaSubgraphManager['getUserPositions']>[0]) {
    return this._getClient(
      this._getSubgraphTypeByIsAdminSdk(),
      user.chainInfo.chainId,
    ).GetUserPositions({
      accountAddress: user.wallet.address.toSolidityValue(),
    })
  }

  getUserPosition({
    user,
    fleetAddress,
  }: Parameters<IArmadaSubgraphManager['getUserPosition']>[0]) {
    return this._getClient(
      this._getSubgraphTypeByIsAdminSdk(),
      user.chainInfo.chainId,
    ).GetUserPosition({
      accountAddress: user.wallet.address.toSolidityValue(),
      vaultId: fleetAddress.toSolidityValue(),
    })
  }

  getPosition(params: Parameters<IArmadaSubgraphManager['getPosition']>[0]) {
    return this._getClient(
      this._getSubgraphTypeByIsAdminSdk(),
      params.positionId.user.chainInfo.chainId,
    ).GetPosition({
      id: params.positionId.id.toLowerCase(),
    })
  }

  getPositionHistory(params: Parameters<IArmadaSubgraphManager['getPositionHistory']>[0]) {
    return this._getClient(
      this._getSubgraphTypeByIsAdminSdk(),
      params.positionId.user.chainInfo.chainId,
    ).GetPositionHistory({
      positionId: params.positionId.id.toLowerCase(),
    })
  }

  getInstitutions(params: Parameters<IArmadaSubgraphManager['getInstitutions']>[0]) {
    return this._getClient(SubgraphTypes.institutions, params.chainId).GetInstitutions()
  }

  getInstitutionById(params: Parameters<IArmadaSubgraphManager['getInstitutionById']>[0]) {
    const id = toHex(params.id, { size: 32 })
    return this._getClient(SubgraphTypes.institutions, params.chainId).GetInstitutionById({
      id,
    })
  }

  getAllRoles(params: Parameters<IArmadaSubgraphManager['getAllRoles']>[0]) {
    const id = toHex(params.institutionId, { size: 32 })
    return this._getClient(SubgraphTypes.institutions, params.chainId).GetRoles({
      id,
      first: params.first ?? 1000,
      skip: params.skip ?? 0,
      name: params.name,
      targetContract: params.targetContract,
      owner: params.owner,
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
    const urlMapForChain = this._urlMap[chainId]
    if (!urlMapForChain) {
      throw new Error(`No subgraph urls found for chainId: ${chainId}`)
    }

    const client = {
      [SubgraphTypes.protocol]: createProtocolGraphQLClient(urlMapForChain.protocol),
      [SubgraphTypes.institutions]: this._isAdminSdk
        ? createInstitutionsGraphQLClient(urlMapForChain.institutions!)
        : undefined,
    }[graph]

    return client as ReturnType<
      {
        [SubgraphTypes.protocol]: typeof createProtocolGraphQLClient
        [SubgraphTypes.institutions]: typeof createInstitutionsGraphQLClient
      }[T]
    >
  }

  _getSubgraphTypeByIsAdminSdk() {
    return this._isAdminSdk ? SubgraphTypes.institutions : SubgraphTypes.protocol
  }
}
