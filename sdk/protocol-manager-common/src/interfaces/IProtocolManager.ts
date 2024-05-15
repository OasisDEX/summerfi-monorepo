import { ILendingPoolId, IPositionId, Maybe } from '@summerfi/sdk-common'
import { IPosition } from '@summerfi/sdk-common/common'
import { IExternalPosition, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import { ILendingPool, ILendingPoolInfo } from '@summerfi/sdk-common/protocols'
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
   * @name getPosition
   * @description Gets the position for the given position ID
   * @param positionId The position ID for the specific protocol
   * @returns The position for the specific protocol
   */
  getPosition(positionId: IPositionId): Promise<IPosition>

  /** IMPORT POSITION */

  /**
   * @name getImportPositionTransaction
   * @description Gets the transaction to import the given external position
   * @param params The parameters to get the import position transaction
   * @returns The transaction to import the given external position, or undefined if not supported
   */
  getImportPositionTransaction(params: {
    user: IUser
    externalPosition: IExternalPosition
    positionsManager: IPositionsManager
  }): Promise<Maybe<TransactionInfo>>
}
