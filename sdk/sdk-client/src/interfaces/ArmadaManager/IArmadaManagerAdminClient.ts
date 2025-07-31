import {
  IAddress,
  IPercentage,
  ITokenAmount,
  TransactionInfo,
  type IArmadaVaultId,
} from '@summerfi/sdk-common'
import { IRebalanceData } from '@summerfi/armada-protocol-common'

/**
 * @name IArmadaManagerAdminClient
 * @description Interface for the Armada Manager Admin client - consolidates all administrative operations
 */
export interface IArmadaManagerAdminClient {
  /**
   * @name rebalance
   * @description Rebalances the fleet using the provided rebalance data. Used by the keeper
   *
   * @param vaultId The ID of the pool
   * @param rebalanceData The data for the rebalance
   *
   * @returns The transaction information
   */
  rebalance(params: {
    vaultId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /**
   * @name adjustBuffer
   * @description Adjusts the buffer of the fleet. Used by the keeper
   *
   * @param vaultId The ID of the pool
   * @param rebalanceData The data for the rebalance
   *
   * @returns The transaction information
   */
  adjustBuffer(params: {
    vaultId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /**
   * @name setFleetDepositCap
   * @description Sets the deposit cap of the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param cap The new deposit cap
   *
   * @returns The transaction information
   */
  setFleetDepositCap(params: {
    vaultId: IArmadaVaultId
    cap: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setTipJar
   * @description Sets the tip jar address of the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param tipJar The address of the new tip jar
   *
   * @returns The transaction information
   */
  setTipJar(params: { vaultId: IArmadaVaultId; tipJar: IAddress }): Promise<TransactionInfo>

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
   * @description Adds an ark to the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param ark The address of the ark to add
   * @param maxDepositCap The maximum deposit cap of the ark
   * @param maxRebalanceOutflow The maximum rebalance outflow of the ark
   * @param maxRebalanceInflow The maximum rebalance inflow of the ark
   *
   * @returns The transaction information
   */
  addArk(params: {
    vaultId: IArmadaVaultId
    ark: IAddress
    maxDepositCap: ITokenAmount
    maxRebalanceOutflow: ITokenAmount
    maxRebalanceInflow: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name addArks
   * @description Adds multiple arks to the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param arks The addresses of the arks to add
   * @param maxDepositCaps The maximum deposit caps of the arks
   * @param maxRebalanceOutflows The maximum rebalance outflows of the arks
   * @param maxRebalanceInflows The maximum rebalance inflows of the arks
   *
   * @returns The transaction information
   */
  addArks(params: {
    vaultId: IArmadaVaultId
    arks: IAddress[]
    maxDepositCaps: ITokenAmount[]
    maxRebalanceOutflows: ITokenAmount[]
    maxRebalanceInflows: ITokenAmount[]
  }): Promise<TransactionInfo>

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
