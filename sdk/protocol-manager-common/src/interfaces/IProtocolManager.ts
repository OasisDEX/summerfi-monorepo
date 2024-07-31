import { ILendingPoolId, Maybe } from '@summerfi/sdk-common'
import {
  ILendingPool,
  ILendingPoolInfo,
  ILendingPosition,
  ILendingPositionId,
} from '@summerfi/sdk-common/lending-protocols'
import {
  IExternalLendingPosition,
  IPositionsManager,
  TransactionInfo,
} from '@summerfi/sdk-common/orders'
import { IUser } from '@summerfi/sdk-common/user'

/**
 * @interface IProtocolManager
 * @description Interface to be implemented by a protocol manager to provide access to protocol-specific functionality
 */
export interface IProtocolManager {
  /** LENDING POOLS */

  /**
   * @name getLendingPool
   * @description Gets the lending pool for the given pool ID
   * @param poolId The pool ID
   * @returns The lending pool for the specific protocol
   */
  getLendingPool(poolId: ILendingPoolId): Promise<ILendingPool>

  /**
   * @name getLendingPoolInfo
   * @description Gets the extended lending pool information for the given pool ID
   * @param poolId The pool ID
   * @returns The extended lending pool information for the specific protocol
   */
  getLendingPoolInfo(poolId: ILendingPoolId): Promise<ILendingPoolInfo>

  /** POSITIONS */

  /**
   * @name getLendingPosition
   * @description Gets the lending position for the given lending position ID
   * @param positionId The lending position ID for the specific protocol
   * @returns The lending position for the specific protocol
   */
  getLendingPosition(positionId: ILendingPositionId): Promise<ILendingPosition>

  /** IMPORT POSITION */

  /**
   * @name getImportPositionTransaction
   * @description Gets the transaction to import the given external position
   * @param params The parameters to get the import position transaction
   * @returns The transaction to import the given external position, or undefined if not supported
   */
  getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalLendingPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>>
}
