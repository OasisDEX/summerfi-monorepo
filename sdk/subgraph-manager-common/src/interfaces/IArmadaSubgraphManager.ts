import type { ChainId, ChainInfo, IAddress, IUser } from '@summerfi/sdk-common'
import type {
  GetUserPositionQuery,
  GetUserPositionsQuery,
  GetVaultQuery,
  GetVaultsQuery,
  GetRebalancesQuery,
} from '../generated/client'

/**
 * @name IArmadaSubgraphManager
 * @description interface for the Armada subgraph manager which will be distinct from the DPM subgraph manager
 */
export interface IArmadaSubgraphManager {
  /**
   * @name getVaults
   * @description get all the vaults
   
  * @param chainId target chain
   *
   * @returns GetVaultsQuery
   *
   * @throws Error
   *
   */
  getVaults(params: { chainId: ChainId }): Promise<GetVaultsQuery>

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
  getVault(params: { chainId: ChainId; vaultId: string }): Promise<GetVaultQuery>

  /**
   * @name getRebalances
   * @description Get all rebalances per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerRebalancesQuery
   */
  getRebalances(params: { chainId: ChainId }): Promise<GetRebalancesQuery>

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
}
