import { IAddress, IPercentage, ITokenAmount, type ChainInfo } from '@summerfi/sdk-common/common'
import { TransactionInfo } from '@summerfi/sdk-common/orders'
import { IUser } from '@summerfi/sdk-common/user'
import { IArmadaVaultId } from './IArmadaVaultId'
import { IArmadaPoolInfo } from './IArmadaPoolInfo'
import { IArmadaPosition } from './IArmadaPosition'
import { IArmadaPositionId } from './IArmadaPositionId'
import { IRebalanceData } from './IRebalanceData'
import type { GetVaultQuery, GetVaultsQuery } from '@summerfi/subgraph-manager-common'

/**
 * @name IArmadaManager
 * @description Interface for the Armada Protocol Manager which handles generating transactions for a Fleet
 */
export interface IArmadaManager {
  /** POOLS */

  /**
   * @name getVaultsRaw
   * @description Get all vaults in the protocol
   *
   * @param chainInfo Chain information
   *
   * @returns GetVaultsQuery
   */
  getVaultsRaw(params: { chainInfo: ChainInfo }): Promise<GetVaultsQuery>

  /**
   * @name getVaultRaw
   * @description Get the specific vault in the protocol
   *
   * @param poolId ID of the pool to retrieve
   *
   * @returns GetVaultQuery
   */
  getVaultRaw(params: { poolId: IArmadaVaultId }): Promise<GetVaultQuery>

  /**
   * @name getPoolInfo
   * @description Get the extended position information for a position
   *
   * @param poolId ID of the pool to retrieve
   *
   * @returns IArmadaPoolInfo The extended information of the pool
   */
  getPoolInfo(params: { poolId: IArmadaVaultId }): Promise<IArmadaPoolInfo>

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

  /** USER TRANSACTIONS */

  /**
   * @name getNewDepositTX
   * @description Returns the transactions needed to deposit tokens in the Fleet for a new position
   *
   * @param poolId ID of the pool to deposit in
   * @param user Address of the user that is trying to deposit
   * @param amount Token amount to be deposited
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getNewDepositTX(params: {
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

  /**
   * @name getUpdateDepositTX
   * @description Returns the transactions needed to deposit tokens in the Fleet for an existing position
   *
   * @param poolId ID of the pool to deposit in
   * @param positionId ID of the position to be updated
   * @param amount Token amount to be deposited
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getUpdateDepositTX(params: {
    poolId: IArmadaVaultId
    positionId: IArmadaPositionId
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

  /**
   * @name getWithdrawTX
   * @description Returns the transactions needed to withdraw tokens from the Fleet
   *
   * @param poolId ID of the pool to withdraw from
   * @param user Address of the user that is trying to withdraw
   * @param amount Token amount to be withdrawn
   *
   * @returns TransactionInfo[] An array of transactions that must be executed for the operation to succeed
   */
  getWithdrawTX(params: {
    poolId: IArmadaVaultId
    user: IUser
    amount: ITokenAmount
  }): Promise<TransactionInfo[]>

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
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
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
    poolId: IArmadaVaultId
    cap: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setTipJar
   * @description Updates the tip jar for the Fleet
   *
   * @returns TransactionInfo The transaction information
   */
  setTipJar(params: { poolId: IArmadaVaultId }): Promise<TransactionInfo>

  /**
   * @name setTipRate
   * @description Sets the tip rate of the fleet. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param rate The new tip rate
   *
   * @returns The transaction information
   */
  setTipRate(params: { poolId: IArmadaVaultId; rate: IPercentage }): Promise<TransactionInfo>

  /**
   * @name addArk
   * @description Adds a new ark to the fleet. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param ark The address of the new ark
   *
   * @returns The transaction information
   */
  addArk(params: { poolId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo>

  /**
   * @name addArks
   * @description Adds a list of new arks to the fleet. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param arks The list of addresses of the new arks
   *
   * @returns The transaction information
   */
  addArks(params: { poolId: IArmadaVaultId; arks: IAddress[] }): Promise<TransactionInfo>

  /**
   * @name removeArk
   * @description Removes an ark from the fleet. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param ark The address of the ark to remove
   *
   * @returns The transaction information
   */
  removeArk(params: { poolId: IArmadaVaultId; ark: IAddress }): Promise<TransactionInfo>

  /**
   * @name setArkDepositCap
   * @description Sets the deposit cap of an ark. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param ark The address of the ark
   * @param cap The new deposit cap
   *
   * @returns The transaction information
   */
  setArkDepositCap(params: {
    poolId: IArmadaVaultId
    ark: IAddress
    cap: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setArkMaxRebalanceOutflow
   * @description Sets the maximum rebalance outflow of an ark. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param ark The address of the ark
   * @param maxRebalanceOutflow The new maximum rebalance outflow
   *
   * @returns The transaction information
   */
  setArkMaxRebalanceOutflow(params: {
    poolId: IArmadaVaultId
    ark: IAddress
    maxRebalanceOutflow: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setArkMaxRebalanceInflow
   * @description Sets the maximum rebalance inflow of an ark. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param ark The address of the ark
   * @param maxRebalanceInflow The new maximum rebalance inflow
   *
   * @returns The transaction information
   */
  setArkMaxRebalanceInflow(params: {
    poolId: IArmadaVaultId
    ark: IAddress
    maxRebalanceInflow: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setArkMinimumBufferBalance
   * @description Sets the minimum buffer balance of an ark. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param ark The address of the ark
   * @param minimumBufferBalance The new minimum buffer balance
   *
   * @returns The transaction information
   */
  setMinimumBufferBalance(params: {
    poolId: IArmadaVaultId
    minimumBufferBalance: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setRebalanceCooldown
   * @description Sets the rebalance cooldown of the fleet. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param cooldown The new rebalance cooldown
   *
   * @returns The transaction information
   */
  updateRebalanceCooldown(params: {
    poolId: IArmadaVaultId
    cooldown: number
  }): Promise<TransactionInfo>

  /**
   * @name forceRebalance
   * @description Forces a rebalance of the fleet. Used by the governance
   *
   * @param poolId The ID of the pool
   * @param rebalanceData The data for the rebalance
   *
   * @returns The transaction information
   */
  forceRebalance(params: {
    poolId: IArmadaVaultId
    rebalanceData: IRebalanceData[]
  }): Promise<TransactionInfo>

  /**
   * @name emergencyShutdown
   * @description Shuts down the fleet in case of an emergency. Used by the governance
   *
   * @param poolId The ID of the pool
   *
   * @returns The transaction information
   */
  emergencyShutdown(params: { poolId: IArmadaVaultId }): Promise<TransactionInfo>

  /** UTILITY FUNCTIONS */

  /**
   * @name convertToShares
   * @description Converts a token amount to shares in the Fleet
   *
   * @param poolId ID of the pool to convert the tokens to shares
   * @param amount Token amount to be converted
   *
   * @returns ITokenAmount The amount of shares that the token amount represents
   */
  convertToShares(params: { poolId: IArmadaVaultId; amount: ITokenAmount }): Promise<ITokenAmount>
}
