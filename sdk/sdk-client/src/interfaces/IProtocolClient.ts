import { ILendingPool, ILendingPoolInfo } from '@summerfi/sdk-common'
import { IProtocol, Maybe } from '@summerfi/sdk-common/common'
import { ILendingPoolIdData } from '@summerfi/sdk-common/lending-protocols'

/**
 * @interface IProtocolClient
 * @description Client interface for protocols, includes some methods to interact with the protocols manager
 * @see IProtocol
 */
export interface IProtocolClient extends IProtocol {
  /**
   * @method getLendingPool
   * @description Get the lending pool from the protocol
   * @param {ILendingPoolIdData} params The pool id data
   * @returns {Promise<Maybe<ILendingPool>>} The lending pool
   */
  getLendingPool(params: { poolId: ILendingPoolIdData }): Promise<Maybe<ILendingPool>>

  /**
   * @method getLendingPoolInfo
   * @description Get the lending pool info from the protocol
   * @param {ILendingPoolIdData} params The pool id data
   * @returns {Promise<Maybe<ILendingPoolInfo>>} The lending pool info
   */
  getLendingPoolInfo(params: { poolId: ILendingPoolIdData }): Promise<Maybe<ILendingPoolInfo>>
}
