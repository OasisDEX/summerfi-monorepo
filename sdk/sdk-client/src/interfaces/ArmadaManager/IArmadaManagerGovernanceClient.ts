import { IArmadaPoolId } from '@summerfi/armada-protocol-common'
import { ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'

/**
 * @interface IArmadaManagerKeepersClient
 * @description Interface of the FleetCommander Keepers manager for the SDK Client. Allows to instantiate
 *              FleetCommanders to interact with them
 */
export interface IArmadaManagerGovernanceClient {
  /**
   * @name setFleetDepositCap
   * @description Sets the deposit cap for the fleet
   *
   * @param poolId ID of the pool to set the deposit cap
   * @param cap Token amount of the deposit cap
   *
   * @returns TransactionInfo The transaction information
   */
  setFleetDepositCap(params: { poolId: IArmadaPoolId; cap: ITokenAmount }): Promise<TransactionInfo>

  /**
   * @name setTipJar
   * @description Sets the tip jar for the fleet
   *
   * @param poolId ID of the pool to set the tip jar
   *
   * @returns TransactionInfo The transaction information
   */
  setTipJar(params: { poolId: IArmadaPoolId }): Promise<TransactionInfo>
}
