import {
  IArmadaVaultId,
  IArmadaPoolInfo,
  IArmadaPosition,
  IArmadaPositionId,
  type GetVaultQuery,
  type GetVaultsQuery,
} from '@summerfi/armada-protocol-common'
import {
  ITokenAmount,
  IUser,
  TransactionInfo,
  type ChainInfo,
  type IAddress,
} from '@summerfi/sdk-common'

/**
 * @interface IArmadaManagerUsersClient
 * @description Interface of the FleetCommander Users manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerUsersClient {
  /**
   * @method getVaultsRaw
   * @description Retrieves all protocol vaults
   *
   * @param chainInfo Chain information
   *
   * @returns All Armada vaults
   */
  getVaultsRaw(params: { chainInfo: ChainInfo }): Promise<GetVaultsQuery>

  /**
   * @method getVaultRaw
   * @description Retrieves a specific protocol vault
   *
   * @param poolId ID of the vault
   *
   * @returns The corresponding Armada vault
   */
  getVaultRaw(params: { poolId: IArmadaVaultId }): Promise<GetVaultQuery>

  /**
   * @method getPoolInfo
   * @description Retrieves the information of an Armada pool by its ID
   *
   * @param poolId ID of the pool to retrieve
   *
   * @returns The information of the corresponding Armada pool
   */
  getPoolInfo(params: { poolId: IArmadaVaultId }): Promise<IArmadaPoolInfo>

  /**
   * @name getUserPositions
   * @description Get all of user positions in the fleet
   *
   * @param user target user
   *
   * @returns IArmadaPosition[] All user positions in the fleet
   *
   */
  getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]>

  /**
   * @method getUserPosition
   * @description Retrieves the position of a user in an Armada pool
   *
   * @param user Target user
   * @param fleetAddress Address of the fleet
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getUserPosition(params: { user: IUser; fleetAddress: IAddress }): Promise<IArmadaPosition>

  /**
   * @method getPosition
   * @description Retrieves the position of a user in an Armada pool
   *
   * @param positionId ID of the position to retrieve
   *
   * @returns The position of the user in the corresponding Armada pool
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition>

  /**
   * @method getNewDepositTX
   * @description Returns the transactions needed to deposit tokens in the Fleet for a new position
   *
   * @param poolId ID of the pool to deposit in
   * @param user Address of the user that is trying to deposit
   * @param amount Token amount to be deposited
   *
   * @returns The transactions needed to deposit the tokens
   */
  getNewDepositTX(params: {
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

  /**
   * @method getUpdateDepositTX
   * @description Returns the transactions needed to deposit tokens in the Fleet for an existing position
   *
   * @param poolId ID of the pool to deposit in
   * @param positionId ID of the position to deposit in
   * @param amount Token amount to be deposited
   *
   * @returns The transactions needed to deposit the tokens
   */
  getUpdateDepositTX(params: {
    poolId: IArmadaVaultId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

  /**
   * @method getWithdrawTX
   * @description Returns the transactions needed to withdraw tokens from the Fleet
   *
   * @param poolId ID of the pool to withdraw from
   * @param user user that is trying to withdraw
   * @param amount Token amount to be withdrawn
   *
   * @returns The transactions needed to withdraw the tokens
   */
  getWithdrawTX(params: {
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>
}
