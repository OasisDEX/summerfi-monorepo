import type { ChainId, IAddress, IArmadaPositionId, IUser } from '@summerfi/sdk-common'
import type {
  GetUserPositionQuery,
  GetUserPositionsQuery,
  GetVaultQuery,
  GetVaultsQuery,
  GetGlobalRebalancesQuery,
  GetUsersActivityQuery,
  GetUserActivityQuery,
  GetPositionQuery,
  GetPositionHistoryQuery,
  Position_Filter,
  GetDepositsQuery,
  GetWithdrawalsQuery,
  GetStakingStatsV2Query,
} from '../generated/protocol/client'
import type {
  GetVaultQuery as GetVaultQueryInstitutions,
  GetVaultsQuery as GetVaultsQueryInstitutions,
  GetInstitutionsQuery,
  GetInstitutionByIdQuery,
  GetRolesQuery,
} from '../generated/institutions/client'

/**
 * @name IArmadaSubgraphManager
 * @description interface for the Armada subgraph manager which will be distinct from the DPM subgraph manager
 */
export interface IArmadaSubgraphManager {
  /**
   * @name getVaults
   * @description get all the vaults
   *
   * @param chainId target chain
   * @param clientId target institution ID (for institutions subgraph only)
   *
   * @returns GetVaultsQuery
   *
   * @throws Error
   *
   */
  getVaults(params: {
    chainId: ChainId
    clientId?: string
  }): Promise<GetVaultsQuery | GetVaultsQueryInstitutions>

  /**
   * @name getVault
   * @description get a specific vault
   *
   * @param chainId target chain
   * @param vaultId target pool
   *
   * @returns GetVaultQuery
   *
   * @throws Error
   *
   */
  getVault(params: {
    chainId: ChainId
    vaultId: string
  }): Promise<GetVaultQuery | GetVaultQueryInstitutions>

  /**
   * @name getGlobalRebalances
   * @description Get all rebalances per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GetGlobalRebalancesQuery
   */
  getGlobalRebalances(params: { chainId: ChainId }): Promise<GetGlobalRebalancesQuery>

  /**
   * @name getUserPositions
   * @description get the positions of a user
   *
   * @param user target user
   *
   * @returns GetUserPositionsQuery
   *
   * @throws Error
   *
   */
  getUserPositions(params: { user: IUser }): Promise<GetUserPositionsQuery>
  /**
   * @name getUserPosition
   * @description get the position of a user in a fleet
   *
   * @param user target user
   * @param fleetAddress Address of the fleet
   *
   * @returns GetUserPositionQuery
   *
   * @throws Error
   *
   */
  getUserPosition(params: { user: IUser; fleetAddress: IAddress }): Promise<GetUserPositionQuery>

  /**
   * @name getPosition
   * @description get the position of a user in a fleet
   *
   * @param positionId Position ID
   *
   * @returns GetUserPositionQuery
   *
   * @throws Error
   *
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<GetPositionQuery>

  /**
   * @name getPositionHistory
   * @description Get position history snapshots for a given position
   *
   * @param positionId Position ID (format: {wallet_address}-{fleet_address})
   *
   * @returns GetPositionHistoryQuery with hourly, daily, and weekly snapshots
   *
   * @throws Error if position not found or query fails
   *
   */
  getPositionHistory(params: { positionId: IArmadaPositionId }): Promise<GetPositionHistoryQuery>

  /**
   * @name getUsersActivity
   * @description Get all rebalances per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GetUsersActivityQuery
   */
  getUsersActivity(params: {
    chainId: ChainId
    where?: Position_Filter
  }): Promise<GetUsersActivityQuery>

  /**
   * @name getUserActivity
   * @description Get all rebalances per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GetUserActivityQuery
   */
  getUserActivity(params: {
    chainId: ChainId
    vaultId: string
    accountAddress: string
  }): Promise<GetUserActivityQuery>

  /**
   * @name getInstitutions
   * @description Get all institutions
   *
   * @param chainId target chain
   *
   * @returns GetInstitutionsQuery
   *
   * @throws Error
   *
   */
  getInstitutions(params: { chainId: ChainId }): Promise<GetInstitutionsQuery>

  /**
   * @name getInstitutionById
   * @description Get a specific institution by ID
   *
   * @param chainId target chain
   * @param id institution ID
   *
   * @returns GetInstitutionByIdQuery
   *
   * @throws Error
   *
   */
  getInstitutionById(params: { chainId: ChainId; id: string }): Promise<GetInstitutionByIdQuery>

  /**
   * @name getAllRoles
   * @description Get all roles for a given chainId with pagination and filtering
   *
   * @param chainId target chain
   * @param clientId institution ID to filter roles by
   * @param first number of items to return (default: 1000)
   * @param skip number of items to skip for pagination (default: 0)
   * @param name optional role name filter
   * @param targetContract optional target contract address filter
   * @param owner optional owner address filter
   *
   * @returns GetRolesQuery
   *
   * @throws Error
   *
   */
  getAllRoles(params: {
    clientId: string
    chainId: ChainId
    first?: number
    skip?: number
    name?: string
    targetContract?: string
    owner?: string
  }): Promise<GetRolesQuery>

  /**
   * @name getDeposits
   * @description Get deposits for a given Armada position ID with optional pagination
   *
   * @param positionId Position ID
   * @param first number of items to return (optional)
   * @param skip number of items to skip for pagination (optional)
   *
   * @returns GetDepositsQuery
   *
   * @throws Error
   *
   */
  getDeposits(params: {
    positionId: IArmadaPositionId
    first?: number
    skip?: number
  }): Promise<GetDepositsQuery>

  /**
   * @name getWithdrawals
   * @description Get withdrawals for a given Armada position ID with optional pagination
   *
   * @param positionId Position ID
   * @param first number of items to return (optional)
   * @param skip number of items to skip for pagination (optional)
   *
   * @returns GetWithdrawalsQuery
   *
   * @throws Error
   *
   */
  getWithdrawals(params: {
    positionId: IArmadaPositionId
    first?: number
    skip?: number
  }): Promise<GetWithdrawalsQuery>

  /**
   * @name getStakingStatsV2
   * @description Get staking stats for a given Armada position ID
   *
   * @param chainId target chain
   * @param id staking stats record ID
   *
   * @returns GetStakingStatsV2Query
   *
   * @throws Error
   *
   */
  getStakingStatsV2(params: { chainId: ChainId; id: string }): Promise<GetStakingStatsV2Query>
}
