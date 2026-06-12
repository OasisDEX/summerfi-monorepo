import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  IArmadaSubgraphManager,
  createProtocolGraphQLClient,
  createInstitutionsGraphQLClient,
  createRwaGraphQLClient,
  SubgraphType,
  SubgraphTypes,
} from '@summerfi/subgraph-manager-common'
import {
  LoggingService,
  toBytes32InHex,
  type ChainId,
  type HexData,
  type InstiVersion,
} from '@summerfi/sdk-common'
import gql from 'graphql-tag'
import { GraphQLClient } from 'graphql-request'

/**
 * @name ArmadaSubgraphManager
 * @implements IArmadaSubgraphManager
 */
export class ArmadaSubgraphManager implements IArmadaSubgraphManager {
  readonly clientId?: string
  readonly instiVersion?: InstiVersion
  readonly config:
    | {
        subgraphType: typeof SubgraphTypes.protocol
      }
    | {
        subgraphType: typeof SubgraphTypes.institutions
      }
    | {
        subgraphType: typeof SubgraphTypes.rwa
      }

  readonly urlMap: Record<
    ChainId,
    {
      protocol: string
      institutions: string
      rwa: string
    }
  >

  /** CONSTRUCTOR */
  constructor(params: {
    configProvider: IConfigurationProvider
    clientId?: string
    instiVersion?: InstiVersion
    extendedCaller?: string
  }) {
    if (params.clientId && !params.instiVersion) {
      throw new Error('instiVersion must be provided when clientId is specified')
    }
    this.clientId = params.clientId
    this.instiVersion = params.instiVersion
    this.config =
      params.clientId && params.instiVersion
        ? {
            subgraphType:
              params.instiVersion === 'v1' ? SubgraphTypes.institutions : SubgraphTypes.rwa,
          }
        : {
            subgraphType: SubgraphTypes.protocol,
          }

    const envName = 'SDK_SUBGRAPH_CONFIG'
    let urlMap
    try {
      urlMap = JSON.parse(params.configProvider.getConfigurationItem({ name: envName }))
    } catch (error: unknown) {
      throw new Error(`Invalid format of env ${envName} for sdk subgraph config`)
    }
    if (!urlMap) {
      throw new Error('No subgraph config in env')
    }
    LoggingService.log(
      `Creating ${params.extendedCaller ?? 'Armada'} subgraph for ${this.config.subgraphType}, clientId ${this.clientId}, instiVersion ${this.instiVersion}`,
    )

    this.urlMap = urlMap
  }

  getVaults({ chainId, clientId }: Parameters<IArmadaSubgraphManager['getVaults']>[0]) {
    try {
      const clientIdToUse = clientId || this.clientId
      if (
        this.config.subgraphType === SubgraphTypes.institutions ||
        this.config.subgraphType === SubgraphTypes.rwa
      ) {
        if (!clientIdToUse) {
          throw new Error(
            'clientId must be provided to fetch vaults for institutions or rwa subgraph' +
              ` (provided: ${clientId}, instance: ${this.clientId})`,
          )
        }
        return this.getClient(this.config.subgraphType, chainId).GetVaults({
          institutionId: this.getInstitutionId(clientIdToUse),
        })
      } else {
        return this.getClient(SubgraphTypes.protocol, chainId).GetVaults()
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
    return this.getClient(this.config.subgraphType, chainId).GetVault({
      id: vaultId,
    })
  }

  getUserPositions({ user }: Parameters<IArmadaSubgraphManager['getUserPositions']>[0]) {
    return this.getClient(this.config.subgraphType, user.chainInfo.chainId).GetUserPositions({
      accountAddress: user.wallet.address.toSolidityValue(),
    })
  }

  getUserPosition({
    user,
    fleetAddress,
  }: Parameters<IArmadaSubgraphManager['getUserPosition']>[0]) {
    return this.getClient(this.config.subgraphType, user.chainInfo.chainId).GetUserPosition({
      accountAddress: user.wallet.address.toSolidityValue(),
      vaultId: fleetAddress.toSolidityValue(),
    })
  }

  getPosition(params: Parameters<IArmadaSubgraphManager['getPosition']>[0]) {
    return this.getClient(
      this.config.subgraphType,
      params.positionId.user.chainInfo.chainId,
    ).GetPosition({
      id: params.positionId.id.toLowerCase(),
    })
  }

  getPositionHistory(params: Parameters<IArmadaSubgraphManager['getPositionHistory']>[0]) {
    return this.getClient(
      this.config.subgraphType,
      params.positionId.user.chainInfo.chainId,
    ).GetPositionHistory({
      positionId: params.positionId.id.toLowerCase(),
    })
  }

  getInstitutions(params: Parameters<IArmadaSubgraphManager['getInstitutions']>[0]) {
    return this.getClient(SubgraphTypes.institutions, params.chainId).GetInstitutions()
  }

  getInstitutionById(params: Parameters<IArmadaSubgraphManager['getInstitutionById']>[0]) {
    return this.getClient(SubgraphTypes.institutions, params.chainId).GetInstitutionById({
      id: toBytes32InHex(params.id),
    })
  }

  async getAllRoles(params: Parameters<IArmadaSubgraphManager['getAllRoles']>[0]) {
    const institutionId = this.getInstitutionId(params.clientId)
    const first = params.first ?? 1000
    const skip = params.skip ?? 0

    // Build where clause dynamically based on provided parameters
    const whereConditions: string[] = [`institution_: { id: $id }, active: true`]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variables: Record<string, any> = {
      id: institutionId,
      first,
      skip,
    }

    if (params.name !== undefined) {
      whereConditions.push(`name: $name`)
      variables.name = params.name
    }
    if (params.targetContract !== undefined) {
      whereConditions.push(`targetContract: $targetContract`)
      variables.targetContract = params.targetContract
    }
    if (params.owner !== undefined) {
      whereConditions.push(`owner: $owner`)
      variables.owner = params.owner
    }

    // Build variable declarations for the query
    const variableDeclarations = [
      `$id: ID!`,
      `$first: Int!`,
      `$skip: Int!`,
      ...(params.name !== undefined ? [`$name: String!`] : []),
      ...(params.targetContract !== undefined ? [`$targetContract: String!`] : []),
      ...(params.owner !== undefined ? [`$owner: String!`] : []),
    ]

    const query = gql`
      query GetRoles(${variableDeclarations.join(', ')}) {
        roles(
          first: $first
          skip: $skip
          where: {
            ${whereConditions.join('\n            ')}
          }
        ) {
          id
          name
          owner
          targetContract
          institution {
            id
          }
        }
      }
    `

    const rawClient = this.getRawClient(params.chainId)
    return rawClient.request(query, variables)
  }

  getGlobalRebalances({ chainId }: Parameters<IArmadaSubgraphManager['getGlobalRebalances']>[0]) {
    return this.getClient(SubgraphTypes.protocol, chainId).GetGlobalRebalances()
  }

  getUsersActivity({ chainId, where }: Parameters<IArmadaSubgraphManager['getUsersActivity']>[0]) {
    return this.getClient(SubgraphTypes.protocol, chainId).GetUsersActivity({ where })
  }

  getUserActivity({
    chainId,
    vaultId,
    accountAddress,
  }: Parameters<IArmadaSubgraphManager['getUserActivity']>[0]) {
    return this.getClient(SubgraphTypes.protocol, chainId).GetUserActivity({
      id: vaultId,
      accountId: accountAddress,
    })
  }

  getDeposits(params: Parameters<IArmadaSubgraphManager['getDeposits']>[0]) {
    return this.getClient(
      this.config.subgraphType,
      params.positionId.user.chainInfo.chainId,
    ).GetDeposits({
      id: params.positionId.id.toLowerCase(),
      first: params.first ?? 1000,
      skip: params.skip ?? 0,
    })
  }

  getWithdrawals(params: Parameters<IArmadaSubgraphManager['getWithdrawals']>[0]) {
    return this.getClient(
      this.config.subgraphType,
      params.positionId.user.chainInfo.chainId,
    ).GetWithdrawals({
      id: params.positionId.id.toLowerCase(),
      first: params.first ?? 1000,
      skip: params.skip ?? 0,
    })
  }

  getStakingStatsV2({ chainId, id }: Parameters<IArmadaSubgraphManager['getStakingStatsV2']>[0]) {
    return this.getClient(SubgraphTypes.protocol, chainId).GetStakingStatsV2({
      id: id.toLowerCase(),
    })
  }

  getStakingStakesV2({
    chainId,
    id,
    first,
    skip,
  }: Parameters<IArmadaSubgraphManager['getStakingStakesV2']>[0]) {
    return this.getClient(SubgraphTypes.protocol, chainId)
      .GetStakingStakesV2({
        first,
        skip,
      })
      .then((result) => ({
        stakeLockups: result.stakeLockups.filter((stake) =>
          stake.id.toLowerCase().startsWith(id.toLowerCase()),
        ),
      }))
  }

  getClient<
    T extends
      | typeof SubgraphTypes.protocol
      | typeof SubgraphTypes.institutions
      | typeof SubgraphTypes.rwa,
  >(
    subgraphType: T,
    chainId: ChainId,
  ): ReturnType<
    {
      [SubgraphTypes.protocol]: typeof createProtocolGraphQLClient
      [SubgraphTypes.institutions]: typeof createInstitutionsGraphQLClient
      [SubgraphTypes.rwa]: typeof createRwaGraphQLClient
    }[T]
  > {
    this.assertSubgraphAccess(subgraphType)

    const urlMapForChain = this.urlMap[chainId]
    if (!urlMapForChain) {
      throw new Error(`No subgraph urls found for chainId: ${chainId}`)
    }

    const client = {
      [SubgraphTypes.protocol]: createProtocolGraphQLClient(urlMapForChain.protocol),
      [SubgraphTypes.institutions]:
        this.config.subgraphType === SubgraphTypes.institutions
          ? createInstitutionsGraphQLClient(urlMapForChain.institutions)
          : undefined,
      [SubgraphTypes.rwa]:
        this.config.subgraphType === SubgraphTypes.rwa
          ? createRwaGraphQLClient(urlMapForChain.rwa)
          : undefined,
    }[subgraphType]

    return client as ReturnType<
      {
        [SubgraphTypes.protocol]: typeof createProtocolGraphQLClient
        [SubgraphTypes.institutions]: typeof createInstitutionsGraphQLClient
        [SubgraphTypes.rwa]: typeof createRwaGraphQLClient
      }[T]
    >
  }

  getInstitutionId(clientId: string): HexData {
    return toBytes32InHex(clientId)
  }

  getSubgraphTypeByIsAdminSdk() {
    return this.config.subgraphType
  }

  assertSubgraphAccess(subgraphType: SubgraphType): void {
    const typeToClientMessage = {
      [SubgraphTypes.protocol]: 'makeSdk',
      [SubgraphTypes.dca]: 'makeSdk',
      [SubgraphTypes.institutions]: 'makeInstiSdk',
      [SubgraphTypes.rwa]: 'makeInstiSdk',
    } as const

    if (this.config.subgraphType !== subgraphType) {
      throw new Error(
        `This method is only available using '${typeToClientMessage[subgraphType]}'. Current subgraph type: ${this.config.subgraphType} which does not have access to ${subgraphType} subgraph`,
      )
    }
  }

  getRawClient(chainId: ChainId) {
    const urlMapForChain = this.urlMap[chainId]
    return new GraphQLClient(urlMapForChain[this.config.subgraphType])
  }
}
