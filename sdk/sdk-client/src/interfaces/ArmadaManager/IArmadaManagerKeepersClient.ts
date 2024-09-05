import { IArmadaPoolId, IRebalanceData } from '@summerfi/armada-protocol-common'
import { TransactionInfo } from '@summerfi/sdk-common'

/**
 * @interface IArmadaManagerKeepersClient
 * @description Interface of the FleetCommander Keepers manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerKeepersClient {
  /**
   * @name rebalance
   * @description Rebalances the assets of the fleet
   *
   * @param poolId The pool id
   * @param rebalanceData Data of the rebalance
   *
   * @returns TransactionInfo The transaction information
   */
  rebalance(params: {
    poolId: IArmadaPoolId
    rebalanceData: IRebalanceData
  }): Promise<TransactionInfo>

  /**
   * @name adjustBuffer
   * @description Adjusts the buffer of the fleet
   *
   * @param poolId The pool id
   * @param rebalanceData Data of the rebalance
   *
   * @returns TransactionInfo The transaction information
   */
  adjustBuffer(params: {
    poolId: IArmadaPoolId
    rebalanceData: IRebalanceData
  }): Promise<TransactionInfo>
}
