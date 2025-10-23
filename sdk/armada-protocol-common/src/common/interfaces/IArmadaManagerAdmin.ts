import type {
  IAddress,
  IPercentage,
  ITokenAmount,
  TransactionInfo,
  IArmadaVaultId,
  ChainId,
  AddressValue,
  IRebalanceData,
  IArkConfig,
} from '@summerfi/sdk-common'

/**
 * @name IArmadaManagerAdmin
 * @description Interface for the Armada Manager Admin which handles administrative operations
 */
export interface IArmadaManagerAdmin {
  /** WRITE OPERATIONS */
  /**
   * @name addArk
   * @description Adds a new ark to the fleet. Used by the governance
   *
   * @param vaultId The ID of the vault
   * @param ark The address of the new ark
   *
   * @returns The transaction information
   */
  addArk(params: { vaultId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo>

  /**
   * @name addArks
   * @description Adds a list of new arks to the fleet. Used by the governance
   *
   * @param vaultId The ID of the vault
   * @param arks The list of addresses of the new arks
   *
   * @returns The transaction information
   */
  addArks(params: { vaultId: IArmadaVaultId; arks: IAddress[] }): Promise<TransactionInfo>

  /**
   * @name adjustBuffer
   * @description Adjusts the buffer of the fleet
   *
   * @param vaultId The ID of the vault
   * @param rebalanceData Data of the rebalance
   *
   * @returns TransactionInfo The transaction information
   */
  adjustBuffer(params: {
    vaultId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /**
   * @name rebalance
   * @description Rebalances the assets of the fleet
   *
   * @param vaultId The ID of the vault
   * @param rebalanceData Data of the rebalance
   *
   * @returns TransactionInfo The transaction information
   */
  rebalance(params: {
    vaultId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /**
   * @name removeArk
   * @description Removes an ark from the fleet. Used by the governance
   *
   * @param vaultId The ID of the vault
   * @param ark The address of the ark to remove
   *
   * @returns The transaction information
   */
  removeArk(params: { vaultId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo>

  /**
   * @name setArkDepositCap
   * @description Sets the deposit cap of an ark. Used by the governance
   *
   * @param vaultId The ID of the vault
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
   * @name setArkMaxDepositPercentageOfTVL
   * @description Sets the maximum deposit percentage of TVL for an ark
   *
   * @param vaultId The ID of the vault
   * @param ark The address of the ark
   * @param percentage The new maximum deposit percentage of TVL
   *
   * @returns The transaction information
   */
  setArkMaxDepositPercentageOfTVL(params: {
    vaultId: IArmadaVaultId
    ark: IAddress
    maxDepositPercentageOfTVL: IPercentage
  }): Promise<TransactionInfo>

  /**
   * @name setArkMaxRebalanceInflow
   * @description Sets the maximum rebalance inflow of an ark. Used by the governance
   *
   * @param vaultId The ID of the vault
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
   * @name setArkMaxRebalanceOutflow
   * @description Sets the maximum rebalance outflow of an ark. Used by the governance
   *
   * @param vaultId The ID of the vault
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
   * @name setFleetDepositCap
   * @description Sets the deposit cap of the Fleet
   *
   * @param vaultId The ID of the vault
   * @param cap The new deposit cap
   *
   * @returns TransactionInfo The transaction information
   */
  setFleetDepositCap(params: {
    vaultId: IArmadaVaultId
    cap: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setMaxRebalanceOperations
   * @description Sets the maximum number of rebalance operations for the fleet
   *
   * @param vaultId The ID of the vault
   * @param maxRebalanceOperations The new maximum number of rebalance operations
   *
   * @returns TransactionInfo The transaction information
   */
  setMaxRebalanceOperations(params: {
    vaultId: IArmadaVaultId
    maxRebalanceOperations: number
  }): Promise<TransactionInfo>

  /**
   * @name setMinimumBufferBalance
   * @description Sets the minimum buffer balance of the fleet. Used by the governance
   *
   * @param vaultId The ID of the vault
   * @param minimumBufferBalance The new minimum buffer balance
   *
   * @returns The transaction information
   */
  setMinimumBufferBalance(params: {
    vaultId: IArmadaVaultId
    minimumBufferBalance: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setTipJar
   * @description Updates the tip jar for the Fleet
   *
   * @param params.chainId The chain ID
   * @param params.addressValue The new address of the tip jar
   *
   * @returns TransactionInfo The transaction information
   */
  setTipJar(params: { chainId: ChainId; addressValue: AddressValue }): Promise<TransactionInfo>

  /**
   * @name setTipRate
   * @description Sets the tip rate of the fleet. Used by the governance
   *
   * @param vaultId The ID of the vault
   * @param rate The new tip rate
   *
   * @returns The transaction information
   */
  setTipRate(params: { vaultId: IArmadaVaultId; rate: IPercentage }): Promise<TransactionInfo>

  /**
   * @name updateRebalanceCooldown
   * @description Updates the rebalance cooldown of the fleet. Used by the governance
   *
   * @param vaultId The ID of the vault
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
   * @param vaultId The ID of the vault
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
   * @param vaultId The ID of the vault
   *
   * @returns The transaction information
   */
  emergencyShutdown(params: { vaultId: IArmadaVaultId }): Promise<TransactionInfo>

  /** READ OPERATIONS */

  /**
   * @name arkConfig
   * @description Gets the configuration of an ark. Used to fetch data from the blockchain
   *
   * @param chainId The chain ID where the ark is deployed
   * @param arkAddressValue The address of the ark
   *
   * @returns Promise<IArkConfig> The ark configuration
   */
  arkConfig(params: { chainId: ChainId; arkAddressValue: AddressValue }): Promise<IArkConfig>

  /**
   * @name arks
   * @description Gets the list of active arks for a fleet. Used to fetch data from the blockchain
   *
   * @param vaultId The ID of the vault
   *
   * @returns Promise<IAddress[]> The list of active ark addresses
   */
  arks(params: { vaultId: IArmadaVaultId }): Promise<IAddress[]>
}
