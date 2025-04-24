import {
  IAddress,
  IPercentage,
  ITokenAmount,
  type IArmadaPosition,
  type IArmadaPositionId,
  type IArmadaVaultId,
  type IArmadaVaultInfo,
  type IChainInfo,
  type IToken,
  TransactionInfo,
  IUser,
  type TransactionPriceImpact,
  type HexData,
} from '@summerfi/sdk-common'
import type {
  GetGlobalRebalancesQuery,
  GetVaultQuery,
  GetVaultsQuery,
  GetUsersActivityQuery,
  GetUserActivityQuery,
  Position_Filter,
} from '@summerfi/subgraph-manager-common'
import type { IRebalanceData } from '@summerfi/contracts-provider-common'
/**
 * @name IArmadaManagerUtils
 * @description Interface for the Armada Protocol Manager which handles generating transactions for a Fleet
 */
export interface IArmadaManagerUtils {
  /**
   * @method getSummerToken
   * @description Retrieves the Summer token for a given chain
   *
   * @param chainInfo Chain information
   *
   * @returns The Summer token for the given chain
   */
  getSummerToken: (params: { chainInfo: IChainInfo }) => IToken

  /** POSITIONS */

  /**
   * @name getUserPositions
   * @description Get all user positions in all fleets
   *
   * @param user target user
   *
   * @returns IArmadaPosition[]
   */
  getUserPositions(params: { user: IUser }): Promise<IArmadaPosition[]>

  /**
   * @name getUserBalance
   * @description Get user position in the fleet
   *
   * @param user target user
   * @param fleetAddress Address of the fleet
   *
   * @returns IArmadaPosition
   */
  getUserPosition(params: { user: IUser; fleetAddress: IAddress }): Promise<IArmadaPosition>

  /**
   * @name getPosition
   * @description Get the position of a user in the specified fleet
   *
   * @param positionId ID of the position to retrieve
   *
   * @returns IArmadaPosition The position of the user in the fleet
   *
   */
  getPosition(params: { positionId: IArmadaPositionId }): Promise<IArmadaPosition>

  /** VAULT */

  /**
   * @name getVaultsRaw
   * @description Get all vaults in the protocol
   *
   * @param chainInfo Chain information
   *
   * @returns GetVaultsQuery
   */
  getVaultsRaw(params: { chainInfo: IChainInfo }): Promise<GetVaultsQuery>

  /**
   * @name getVaultRaw
   * @description Get the specific vault in the protocol
   *
   * @param vaultId ID of the pool to retrieve
   *
   * @returns GetVaultQuery
   */
  getVaultRaw(params: { vaultId: IArmadaVaultId }): Promise<GetVaultQuery>

  /**
   * @name getGlobalRebalancesRaw
   * @description Get all rebalances per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerRebalancesQuery
   */
  getGlobalRebalancesRaw(params: { chainInfo: IChainInfo }): Promise<GetGlobalRebalancesQuery>

  /**
   * @name getUsersActivityRaw
   * @description Get all users activity per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUsersActivityRaw(params: {
    chainInfo: IChainInfo
    where?: Position_Filter
  }): Promise<GetUsersActivityQuery>

  /**
   * @name getUserActivityRaw
   * @description Get all user activity per given chain
   *
   * @param chainInfo Chain information
   *
   * @returns GerUsersActivityQuery
   */
  getUserActivityRaw(params: {
    vaultId: IArmadaVaultId
    accountAddress: string
  }): Promise<GetUserActivityQuery>

  /**
   * @name getVaultInfo
   * @description Get the extended information of the vault
   *
   * @param vaultId ID of the vault to retrieve
   *
   * @returns IArmadaVaultInfo The extended information of the vault
   */
  getVaultInfo(params: { vaultId: IArmadaVaultId }): Promise<IArmadaVaultInfo>

  /**
   * @name getFleetShares
   */
  getFleetShares(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount>

  /**
   * @name getStakedShares
   */
  getStakedShares(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<ITokenAmount>

  /**
   * @name getFleetBalance
   * @description Get the balance of a user in a fleet
   *
   * @param vaultId ID of the pool to retrieve the shares
   * @param user Address of the user to retrieve the shares
   *
   * @returns ITokenAmount The amount of assets the user has in the fleet
   */
  getFleetBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /**
   * @name getStakedBalance
   * @description Get the staked balance of a user in a rewards pool
   *
   * @param vaultId ID of the vault to retrieve the balance
   * @param user Address of the user to retrieve the balance
   *
   * @returns ITokenAmount The amount of assets the user has staked
   */
  getStakedBalance(params: {
    vaultId: IArmadaVaultId
    user: IUser
  }): Promise<{ shares: ITokenAmount; assets: ITokenAmount }>

  /**
   *
   * @name getTotalBalance
   * @description Get the total balance of a user in a fleet
   *
   * @param vaultId ID of the pool to retrieve the shares
   * @param user Address of the user to retrieve the shares
   *
   * @returns ITokenAmount The total amount of assets the user has in the fleet
   */
  getTotalBalance(params: { vaultId: IArmadaVaultId; user: IUser }): Promise<{
    shares: ITokenAmount
    assets: ITokenAmount
  }>

  /** KEEPERS TRANSACTIONS */

  /**
   * @name rebalance
   * @description Rebalances the assets of the fleet
   *
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
   * @param rebalanceData Data of the rebalance
   *
   * @returns TransactionInfo The transaction information
   */
  adjustBuffer(params: {
    vaultId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /** GOVERNANCE TRANSACTIONS */

  /**
   * @name setFleetDepositCap
   * @description Sets the deposit cap of the Fleet
   *
   * @param cap The new deposit cap
   *
   * @returns TransactionInfo The transaction information
   */
  setFleetDepositCap(params: {
    vaultId: IArmadaVaultId
    cap: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setTipJar
   * @description Updates the tip jar for the Fleet
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
   * @name setMinimumBufferBalance
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

  /** UTILITY FUNCTIONS */

  /**
   * @name convertToShares
   * @description Converts a token amount to shares in the Fleet
   *
   * @param vaultId ID of the vault to convert the tokens to shares
   * @param amount Token amount to be converted
   *
   * @returns ITokenAmount The amount of shares that the token amount represents
   */
  convertToShares(params: { vaultId: IArmadaVaultId; amount: ITokenAmount }): Promise<ITokenAmount>

  /**
   * @name convertToAssets
   * @description Converts shares to token amount in the Fleet
   *
   * @param vaultId ID of the vault to convert the tokens to shares
   * @param amount Token amount to be converted
   *
   * @returns ITokenAmount The amount of token that the shares represents
   */
  convertToAssets(params: { vaultId: IArmadaVaultId; amount: ITokenAmount }): Promise<ITokenAmount>

  /**
   * @name getSwapCall
   * @description Get the swap call for a given vault
   *
   * @param vaultId ID of the vault to swap
   * @param fromAmount Amount of tokens to swap
   * @param toToken Token to swap to
   * @param slippage Slippage percentage
   *
   * @returns The swap call data, minimum amount and to amount
   */
  getSwapCall(params: {
    vaultId: IArmadaVaultId
    fromAmount: ITokenAmount
    toToken: IToken
    slippage: IPercentage
  }): Promise<{
    calldata: HexData
    minAmount: ITokenAmount
    toAmount: ITokenAmount
  }>

  /**
   * @name getPriceImpact
   * @description Get the price impact of a swap
   *
   * @param fromAmount The amount of tokens to swap
   * @param toAmount The amount of tokens to receive
   *
   * @returns TransactionPriceImpact The price impact of the swap
   */
  getPriceImpact(params: {
    fromAmount: ITokenAmount
    toAmount: ITokenAmount
  }): Promise<TransactionPriceImpact>
}
