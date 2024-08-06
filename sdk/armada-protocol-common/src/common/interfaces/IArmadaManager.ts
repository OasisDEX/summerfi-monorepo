import { ITokenAmount } from '@summerfi/sdk-common/common'
import { TransactionInfo } from '@summerfi/sdk-common/orders'
import { IUser } from '@summerfi/sdk-common/user'
import { IArmadaPool } from './IArmadaPool'
import { IArmadaPoolId } from './IArmadaPoolId'
import { IArmadaPoolInfo } from './IArmadaPoolInfo'
import { IArmadaPosition } from './IArmadaPosition'

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
   * @name getPosition
   * @description Get the position of a user in the specified fleet
   *
   * @param user Address of the user to get the position for
   * @param poolId ID of the pool to retrieve
   *
   * @returns IArmadaPosition The position of the user in the fleet
   *
   */
  getPosition(params: { user: IUser; poolId: IArmadaPoolId }): Promise<IArmadaPosition>

  /** TRANSACTIONS */

  /**
   * @name getDepositTX
   * @description Returns the transactions needed to deposit tokens in the Fleet
   *
   * @param poolId ID of the pool to deposit in
   * @param user Address of the user that is trying to deposit
   * @param amount Token amount to be deposited
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getDepositTX(params: {
    poolId: IArmadaPoolId
    user: IUser
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
}
