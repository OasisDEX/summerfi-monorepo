import { IRebalanceData } from '@summerfi/armada-protocol-common'
import { TransactionInfo, type IArmadaVaultId } from '@summerfi/sdk-common'

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
   * @param vaultId The vault id
   * @param rebalanceData Data of the rebalance
   *
   * @returns TransactionInfo The transaction information
   */
  rebalance(params: {
    vaultId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /**
   * @name adjustBuffer
   * @description Adjusts the buffer of the fleet
   *
   * @param vaultId The vault id
   * @param rebalanceData Data of the rebalance
   *
   * @returns TransactionInfo The transaction information
   */
  adjustBuffer(params: {
    vaultId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>
}
