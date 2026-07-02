import {
  type IArmadaPosition,
  type IArmadaPositionId,
  type IArmadaVaultId,
  type IChainInfo,
  IUser,
  type IArmadaDeposit,
  type IArmadaWithdrawal,
  type HistoricalFleetRateResult,
  type AddressValue,
  type ChainId,
  IAddress,
} from '@summerfi/sdk-common'
import type {
  GetGlobalRebalancesQuery,
  GetVaultQuery,
  GetVaultsQuery,
  GetUsersActivityQuery,
  GetUserActivityQuery,
  GetPositionHistoryQuery,
  Position_Filter,
} from '@summerfi/subgraph-manager-common'

/**
 * Interface for managing Armada positions and vault data
 */
export interface IArmadaManagerPositions {
  /**
   * Get all user positions in all fleets
   *
   * @param user target user
   *
   * @returns IArmadaPosition[]
   */
  getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]>

  /**
   * Get user position in the fleet
   *
   * @param user target user
   * @param fleetAddress Address of the fleet
   *
   * @returns IArmadaPosition
   */
  getUserPosition(params: {
    user: IUser
    fleetAddress: IAddress
  }): Promise<IArmadaPosition | undefined>

  /**
   * Get the position of a user in the specified fleet
   *
   * @param positionId ID of the position to retrieve
   *
   * @returns IArmadaPosition The position of the user in the fleet
   *
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition | undefined>

  /**
   * Get historical snapshots of a position including hourly, daily, and weekly data
   *
   * @param positionId ID of the position to retrieve history for
   *
   * @returns GetPositionHistoryQuery containing position history snapshots
   */
  getPositionHistory(params: { positionId: IArmadaPositionId }): Promise<GetPositionHistoryQuery>

  /**
   * Get all vaults in the protocol
   *
   * @param chainInfo Chain information
   *
   * @returns GetVaultsQuery
   */
  getVaultsRaw(params: { chainInfo: IChainInfo }): Promise<GetVaultsQuery>

  /**
   * Get the specific vault in the protocol
   *
   * @param vaultId ID of the pool to retrieve
   *
   * @returns GetVaultQuery
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQuery>

  /**
   * Get all rebalances per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerRebalancesQuery
   */
  getGlobalRebalancesRaw(params: { chainInfo: IChainInfo }): Promise<GetGlobalRebalancesQuery>

  /**
   * Get all users activity per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUsersActivityRaw(params: {
    chainInfo: IChainInfo
    where?: Position_Filter
  }): Promise<GetUsersActivityQuery>

  /**
   * Get all user activity per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUserActivityRaw(params: {
    vaultId: IArmadaVaultId
    accountAddress: string
  }): Promise<GetUserActivityQuery>

  /**
   * Get historical rates for multiple vaults
   *
   * @param fleets Array of fleet addresses and chain IDs
   *
   * @returns Historical fleet rate results
   */
  getVaultsHistoricalRates(params: {
    fleets: { fleetAddress: AddressValue; chainId: ChainId }[]
  }): Promise<HistoricalFleetRateResult[]>

  /**
   * Get deposits for a given Armada position ID with optional pagination
   *
   * @param positionId Position ID
   * @param first Optional number of items to return
   * @param skip Optional number of items to skip for pagination
   *
   * @returns Array of deposit transactions with amount, timestamp, and vault balance
   */
  getDeposits(params: {
    positionId: IArmadaPositionId
    first?: number
    skip?: number
  }): Promise<IArmadaDeposit[]>

  /**
   * Get withdrawals for a given Armada position ID with optional pagination
   *
   * @param positionId Position ID
   * @param first Optional number of items to return
   * @param skip Optional number of items to skip for pagination
   *
   * @returns Array of withdrawal transactions with amount, timestamp, and vault balance
   */
  getWithdrawals(params: {
    positionId: IArmadaPositionId
    first?: number
    skip?: number
  }): Promise<IArmadaWithdrawal[]>
}
