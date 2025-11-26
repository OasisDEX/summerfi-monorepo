import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  IArmadaSubgraphManager,
  createProtocolGraphQLClient,
  createInstitutionsGraphQLClient,
  SubgraphType,
  SubgraphTypes,
} from '@summerfi/subgraph-manager-common'
import { LoggingService, toBytes32InHex, type ChainId, type HexData } from '@summerfi/sdk-common'

/**
 * @name ArmadaSubgraphManager
 * @implements IArmadaSubgraphManager
 */
export class ArmadaSubgraphManager implements IArmadaSubgraphManager {
  private readonly _config:
    | {
        subgraphType: typeof SubgraphTypes.protocol
      }
    | {
        subgraphType: typeof SubgraphTypes.institutions
      }

  private readonly _urlMap: Record<
    ChainId,
    {
      protocol: string
      institutions?: string
    }
  >

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider; clientId?: string }) {
    this._config = params.clientId
      ? {
          subgraphType: SubgraphTypes.institutions,
        }
      : {
          subgraphType: SubgraphTypes.protocol,
        }

    const envName = params.clientId ? 'SDK_SUBGRAPH_CONFIG_INSTI' : 'SDK_SUBGRAPH_CONFIG'
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

  getVaults({ chainId, clientId }: Parameters<IArmadaSubgraphManager['getVaults']>[0]) {
    try {
      if (clientId) {
        return this._getClient(SubgraphTypes.institutions, chainId).GetVaults({
          institutionId: this._getInstitutionId(clientId),
        })
      } else {
        return this._getClient(SubgraphTypes.protocol, chainId).GetVaults()
      }
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
    return this._getClient(this._config.subgraphType, chainId).GetVault({
      id: vaultId,
    })
  }

  getUserPositions({ user }: Parameters<IArmadaSubgraphManager['getUserPositions']>[0]) {
    return this._getClient(this._config.subgraphType, user.chainInfo.chainId).GetUserPositions({
      accountAddress: user.wallet.address.toSolidityValue(),
    })
  }

  getUserPosition({
    user,
    fleetAddress,
  }: Parameters<IArmadaSubgraphManager['getUserPosition']>[0]) {
    return this._getClient(this._config.subgraphType, user.chainInfo.chainId).GetUserPosition({
      accountAddress: user.wallet.address.toSolidityValue(),
      vaultId: fleetAddress.toSolidityValue(),
    })
  }

  getPosition(params: Parameters<IArmadaSubgraphManager['getPosition']>[0]) {
    return this._getClient(
      this._config.subgraphType,
      params.positionId.user.chainInfo.chainId,
    ).GetPosition({
      id: params.positionId.id.toLowerCase(),
    })
  }

  getPositionHistory(params: Parameters<IArmadaSubgraphManager['getPositionHistory']>[0]) {
    return this._getClient(
      this._config.subgraphType,
      params.positionId.user.chainInfo.chainId,
    ).GetPositionHistory({
      positionId: params.positionId.id.toLowerCase(),
    })
  }

  getInstitutions(params: Parameters<IArmadaSubgraphManager['getInstitutions']>[0]) {
    return this._getClient(SubgraphTypes.institutions, params.chainId).GetInstitutions()
  }

  getInstitutionById(params: Parameters<IArmadaSubgraphManager['getInstitutionById']>[0]) {
    return this._getClient(SubgraphTypes.institutions, params.chainId).GetInstitutionById({
      id: toBytes32InHex(params.id),
    })
  }

  getAllRoles(params: Parameters<IArmadaSubgraphManager['getAllRoles']>[0]) {
    return this._getClient(SubgraphTypes.institutions, params.chainId).GetRoles({
      id: this._getInstitutionId(params.clientId),
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

  getStakingStatsV2({ chainId, id }: Parameters<IArmadaSubgraphManager['getStakingStatsV2']>[0]) {
    return this._getClient(SubgraphTypes.protocol, chainId).GetStakingStatsV2({
      id: id.toLowerCase(),
    })
  }

  /** PRIVATE */
  _getClient<T extends SubgraphType>(
    subgraphType: T,
    chainId: ChainId,
  ): ReturnType<
    {
      [SubgraphTypes.protocol]: typeof createProtocolGraphQLClient
      [SubgraphTypes.institutions]: typeof createInstitutionsGraphQLClient
    }[T]
  > {
    if (subgraphType === SubgraphTypes.institutions) {
      this._assertSubgraphAccess(SubgraphTypes.institutions)
    }

    const urlMapForChain = this._urlMap[chainId]
    if (!urlMapForChain) {
      throw new Error(`No subgraph urls found for chainId: ${chainId}`)
    }

    const client = {
      [SubgraphTypes.protocol]: createProtocolGraphQLClient(urlMapForChain.protocol),
      [SubgraphTypes.institutions]:
        this._config.subgraphType === SubgraphTypes.institutions
          ? createInstitutionsGraphQLClient(urlMapForChain.institutions!)
          : undefined,
    }[subgraphType]

    return client as ReturnType<
      {
        [SubgraphTypes.protocol]: typeof createProtocolGraphQLClient
        [SubgraphTypes.institutions]: typeof createInstitutionsGraphQLClient
      }[T]
    >
  }

  _getSubgraphTypeByIsAdminSdk() {
    return this._config.subgraphType
  }

  _assertSubgraphAccess(subgraphType: SubgraphType): void {
    const typeToClient = {
      [SubgraphTypes.protocol]: 'makeSdk',
      [SubgraphTypes.institutions]: 'makeAdminSdk',
    } as const

    if (this._config.subgraphType !== subgraphType) {
      throw new Error(`This method is only available using '${typeToClient[subgraphType]}'`)
    }
  }

  _getInstitutionId(clientId: string): HexData {
    return toBytes32InHex(clientId)
  }
}
