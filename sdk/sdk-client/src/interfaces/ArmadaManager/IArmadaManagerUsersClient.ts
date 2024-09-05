import {
  IArmadaPool,
  IArmadaPoolId,
  IArmadaPoolInfo,
  IArmadaPosition,
  IArmadaPositionId,
} from '@summerfi/armada-protocol-common'
import { ITokenAmount, IUser, TransactionInfo } from '@summerfi/sdk-common'

/**
 * @interface IArmadaManagerUsersClient
 * @description Interface of the FleetCommander Users manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerUsersClient {
  /**
   * @method getPool
   * @description Retrieves an Armada pool by its ID
   *
   * @param poolId ID of the pool to retrieve
   *
   * @returns The corresponding Armada pool
   */
  getPool(params: { poolId: IArmadaPoolId }): Promise<IArmadaPool>

  /**
   * @method getPoolInfo
   * @description Retrieves the information of an Armada pool by its ID
   *
   * @param poolId ID of the pool to retrieve
   *
   * @returns The information of the corresponding Armada pool
   */
  getPoolInfo(params: { poolId: IArmadaPoolId }): Promise<IArmadaPoolInfo>

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
    poolId: IArmadaPoolId
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
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

  /**
   * @method getWithdrawTX
   * @description Returns the transactions needed to withdraw tokens from the Fleet
   *
   * @param poolId ID of the pool to withdraw from
   * @param positionId ID of the position to withdraw from
   * @param amount Token amount to be withdrawn
   *
   * @returns The transactions needed to withdraw the tokens
   */
  getWithdrawTX(params: {
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>
}
