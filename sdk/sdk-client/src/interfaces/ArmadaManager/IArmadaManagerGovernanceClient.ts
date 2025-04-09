import { IRebalanceData } from '@summerfi/armada-protocol-common'
import {
  IAddress,
  IPercentage,
  ITokenAmount,
  TransactionInfo,
  type IArmadaVaultId,
} from '@summerfi/sdk-common'

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
   * @param vaultId ID of the pool to set the deposit cap
   * @param cap Token amount of the deposit cap
   *
   * @returns TransactionInfo The transaction information
   */
  setFleetDepositCap(params: {
    vaultId: IArmadaVaultId
    cap: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setTipJar
   * @description Sets the tip jar for the fleet
   *
   * @param vaultId ID of the pool to set the tip jar
   *
   * @returns TransactionInfo The transaction information
   */
  setTipJar(params: { vaultId: IArmadaVaultId }): Promise<TransactionInfo>

  /**
   * @name setTipRate
   * @description Sets the tip rate of the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param rate The new tip rate
   *
   * @returns The transaction information
   */
  setTipRate(params: { vaultId: IArmadaVaultId; rate: IPercentage }): Promise<TransactionInfo>

  /**
   * @name addArk
   * @description Adds a new ark to the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param ark The address of the new ark
   *
   * @returns The transaction information
   */
  addArk(params: { vaultId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo>

  /**
   * @name addArks
   * @description Adds a list of new arks to the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param arks The list of addresses of the new arks
   *
   * @returns The transaction information
   */
  addArks(params: { vaultId: IArmadaVaultId; arks: IAddress[] }): Promise<TransactionInfo>

  /**
   * @name removeArk
   * @description Removes an ark from the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param ark The address of the ark to remove
   *
   * @returns The transaction information
   */
  removeArk(params: { vaultId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo>

  /**
   * @name setArkDepositCap
   * @description Sets the deposit cap of an ark. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param ark The address of the ark
   * @param cap The new deposit cap
   *
   * @returns The transaction information
   */
  setArkDepositCap(params: {
    vaultId: IArmadaVaultId
    ark: IAddress
    cap: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setArkMaxRebalanceOutflow
   * @description Sets the maximum rebalance outflow of an ark. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param ark The address of the ark
   * @param maxRebalanceOutflow The new maximum rebalance outflow
   *
   * @returns The transaction information
   */
  setArkMaxRebalanceOutflow(params: {
    vaultId: IArmadaVaultId
    ark: IAddress
    maxRebalanceOutflow: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setArkMaxRebalanceInflow
   * @description Sets the maximum rebalance inflow of an ark. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param ark The address of the ark
   * @param maxRebalanceInflow The new maximum rebalance inflow
   *
   * @returns The transaction information
   */
  setArkMaxRebalanceInflow(params: {
    vaultId: IArmadaVaultId
    ark: IAddress
    maxRebalanceInflow: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setArkMinimumBufferBalance
   * @description Sets the minimum buffer balance of an ark. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param ark The address of the ark
   * @param minimumBufferBalance The new minimum buffer balance
   *
   * @returns The transaction information
   */
  setMinimumBufferBalance(params: {
    vaultId: IArmadaVaultId
    minimumBufferBalance: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setRebalanceCooldown
   * @description Sets the rebalance cooldown of the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param cooldown The new rebalance cooldown
   *
   * @returns The transaction information
   */
  updateRebalanceCooldown(params: {
    vaultId: IArmadaVaultId
    cooldown: number
  }): Promise<TransactionInfo>

  /**
   * @name forceRebalance
   * @description Forces a rebalance of the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param rebalanceData The data for the rebalance
   *
   * @returns The transaction information
   */
  forceRebalance(params: {
    vaultId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /**
   * @name emergencyShutdown
   * @description Shuts down the fleet in case of an emergency. Used by the governance
   *
   * @param vaultId The ID of the pool
   *
   * @returns The transaction information
   */
  emergencyShutdown(params: { vaultId: IArmadaVaultId }): Promise<TransactionInfo>
}
