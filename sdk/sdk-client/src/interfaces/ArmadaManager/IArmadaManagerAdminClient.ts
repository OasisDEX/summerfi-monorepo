import {
  IAddress,
  IPercentage,
  ITokenAmount,
  TransactionInfo,
  type AddressValue,
  type ChainId,
  type IArmadaVaultId,
  type IArkConfig,
  type IRebalanceData,
  type IFeeRevenueConfig,
  type IChainInfo,
} from '@summerfi/sdk-common'
import type {
  GetVaultQueryInstitutions,
  GetVaultsQueryInstitutions,
} from '@summerfi/armada-protocol-common'

/**
 * Interface for the Armada Manager Admin client - consolidates all administrative operations
 */
export interface IArmadaManagerAdminClient {
  /**
   * Rebalances the fleet using the provided rebalance data. Used by the keeper
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
   * Sets the deposit cap of the fleet. Used by the governance
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
   * Sets the tip jar address of the fleet. Used by the governance
   *
   * @returns The transaction information
   */
  setTipJar(params: { chainId: ChainId; addressValue: AddressValue }): Promise<TransactionInfo>

  /**
   * Sets the tip rate of the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param rate The new tip rate
   *
   * @returns The transaction information
   */
  setTipRate(params: { vaultId: IArmadaVaultId; rate: IPercentage }): Promise<TransactionInfo>

  /**
   * Sets the performance fee rate of the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param rate The new performance fee rate
   *
   * @returns The transaction information
   */
  setPerformanceFeeRate(params: {
    vaultId: IArmadaVaultId
    rate: IPercentage
  }): Promise<TransactionInfo>

  /**
   * Adds an ark to the fleet. Used by the governance
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
   * Adds multiple arks to the fleet. Used by the governance
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
   * Removes an ark from the fleet. Used by the governance
   *
   * @param vaultId The ID of the pool
   * @param ark The address of the ark to remove
   *
   * @returns The transaction information
   */
  removeArk(params: { vaultId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo>

  /**
   * Gets the list of active arks for a fleet
   *
   * @param vaultId The ID of the vault
   *
   * @returns The list of active ark addresses
   */
  arks(params: { vaultId: IArmadaVaultId }): Promise<IAddress[]>

  /**
   * Sets the deposit cap of an ark. Used by the governance
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
   * Sets the maximum deposit percentage of TVL for an ark
   *
   * @param vaultId The ID of the vault
   * @param ark The address of the ark
   * @param maxDepositPercentageOfTVL The new maximum deposit percentage of TVL
   *
   * @returns The transaction information
   */
  setArkMaxDepositPercentageOfTVL(params: {
    vaultId: IArmadaVaultId
    ark: IAddress
    maxDepositPercentageOfTVL: IPercentage
  }): Promise<TransactionInfo>

  /**
   * Sets the maximum rebalance outflow of an ark. Used by the governance
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
   * Sets the maximum rebalance inflow of an ark. Used by the governance
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
   * Sets the minimum buffer balance of an ark. Used by the governance
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
   * Sets the rebalance cooldown of the fleet. Used by the governance
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
   * Forces a rebalance of the fleet. Used by the governance
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
   * Shuts down the fleet in case of an emergency. Used by the governance
   *
   * @param vaultId The ID of the pool
   *
   * @returns The transaction information
   */
  emergencyShutdown(params: { vaultId: IArmadaVaultId }): Promise<TransactionInfo>

  /**
   * Gets the configuration of an ark. Used to fetch data from the blockchain
   *
   * @param chainId The chain ID where the ark is deployed
   * @param arkAddressValue The address of the ark
   *
   * @returns Promise<IArkConfig> The ark configuration
   */
  arkConfig(params: { chainId: ChainId; arkAddressValue: AddressValue }): Promise<IArkConfig>

  /**
   * Gets the fee revenue configuration with hardcoded values per chain
   *
   * @param vaultId The ID of the vault
   *
   * @returns Promise<IFeeRevenueConfig> The fee revenue configuration
   */
  getFeeRevenueConfig(params: { vaultId: IArmadaVaultId }): Promise<IFeeRevenueConfig>

  /**
   * Gets the tip rate of the fleet. Used to fetch data from the blockchain
   *
   * @param vaultId The ID of the vault
   *
   * @returns Promise<bigint> The tip rate as a bigint
   */
  tipRate(params: { vaultId: IArmadaVaultId }): Promise<bigint>

  /**
   * Retrieves all protocol vaults
   *
   * @param chainInfo Chain information
   *
   * @returns All Armada vaults
   */
  getVaultsRaw(params: { chainInfo: IChainInfo }): Promise<GetVaultsQueryInstitutions>

  /**
   * Retrieves a specific protocol vault
   *
   * @param vaultId ID of the vault
   *
   * @returns The corresponding Armada vault
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQueryInstitutions>
}
