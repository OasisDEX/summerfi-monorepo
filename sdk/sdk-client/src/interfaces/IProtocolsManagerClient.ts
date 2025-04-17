import { Maybe, ILendingPool, ILendingPoolIdData, ILendingPoolInfo } from '@summerfi/sdk-common'

/**
 * @interface IProtocolsManagerClient
 * @description Interface of the ProtocolsManager for the SDK Client. Allows to retrieve information for a Protocol
 * @see IProtocolsManager
 */
export interface IProtocolsManagerClient {
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
