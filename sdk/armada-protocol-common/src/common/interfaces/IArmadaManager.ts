import { ITokenAmount } from '@summerfi/sdk-common/common'
import { TransactionInfo } from '@summerfi/sdk-common/orders'
import { IUser } from '@summerfi/sdk-common/user'
import { IArmadaPool } from './IArmadaPool'
import { IArmadaPoolId } from './IArmadaPoolId'
import { IArmadaPoolInfo } from './IArmadaPoolInfo'
import { IArmadaPosition } from './IArmadaPosition'
import { IArmadaPositionId } from './IArmadaPositionId'
import { IRebalanceData } from './IRebalanceData'

/**
 * @name IArmadaManager
 * @description Interface for the Armada Protocol Manager which handles generating transactions for a Fleet
 */
export interface IArmadaManager {
  /** POOLS */

  /**
   * @name getPool
   * @description Get the position of a user in the specified fleet
   *
   * @param poolId ID of the pool to retrieve
   *
   * @returns IArmadaPool The pool with the specified ID
   *
   */
  getPool(params: { poolId: IArmadaPoolId }): Promise<IArmadaPool>

  /**
   * @name getPoolInfo
   * @description Get the extended position information for a position
   *
   * @param poolId ID of the pool to retrieve
   *
   * @returns IArmadaPoolInfo The extended information of the pool
   */
  getPoolInfo(params: { poolId: IArmadaPoolId }): Promise<IArmadaPoolInfo>

  /** POSITIONS */

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
   * @name getPosition
   * @description Get the position of a user in the specified fleet
   *
   * @param positionId ID of the position to retrieve
   *
   * @returns IArmadaPosition The position of the user in the fleet
   *
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition>

  /** USER TRANSACTIONS */

  /**
   * @name getNewDepositTX
   * @description Returns the transactions needed to deposit tokens in the Fleet for a new position
   *
   * @param poolId ID of the pool to deposit in
   * @param user Address of the user that is trying to deposit
   * @param amount Token amount to be deposited
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getNewDepositTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

  /**
   * @name getUpdateDepositTX
   * @description Returns the transactions needed to deposit tokens in the Fleet for an existing position
   *
   * @param poolId ID of the pool to deposit in
   * @param positionId ID of the position to be updated
   * @param amount Token amount to be deposited
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getUpdateDepositTX(params: {
    poolId: IArmadaPoolId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

  /**
   * @name getWithdrawTX
   * @description Returns the transactions needed to withdraw tokens from the Fleet
   *
   * @param poolId ID of the pool to withdraw from
   * @param user Address of the user that is trying to withdraw
   * @param amount Token amount to be withdrawn
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getWithdrawTX(params: {
    poolId: IArmadaPoolId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

  /** KEEPERS TRANSACTIONS */

  /**
   * @name rebalance
   * @description Rebalances the assets of the fleet
   *
   * @param rebalanceData Data of the rebalance
   *
   * @returns TransactionInfo The transaction information
   */
  rebalance(params: {
    poolId: IArmadaPoolId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /**
   * @name adjustBuffer
   * @description Adjusts the buffer of the fleet
   *
   * @param rebalanceData Data of the rebalance
   *
   * @returns TransactionInfo The transaction information
   */
  adjustBuffer(params: {
    poolId: IArmadaPoolId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /** GOVERNANCE TRANSACTIONS */

  /**
   * @name setFleetDepositCap
   * @description Sets the deposit cap of the Fleet
   *
   * @param cap The new deposit cap
   *
   * @returns TransactionInfo The transaction information
   */
  setFleetDepositCap(params: { poolId: IArmadaPoolId; cap: ITokenAmount }): Promise<TransactionInfo>

  /**
   * @name setTipJar
   * @description Updates the tip jar for the Fleet
   *
   * @returns TransactionInfo The transaction information
   */
  setTipJar(params: { poolId: IArmadaPoolId }): Promise<TransactionInfo>

  /** UTILITY FUNCTIONS */

  /**
   * @name convertToShares
   * @description Converts a token amount to shares in the Fleet
   *
   * @param poolId ID of the pool to convert the tokens to shares
   * @param amount Token amount to be converted
   *
   * @returns ITokenAmount The amount of shares that the token amount represents
   */
  convertToShares(params: { poolId: IArmadaPoolId; amount: ITokenAmount }): Promise<ITokenAmount>
}
