import { IAddress, IPercentage, ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'
import { IErc20Contract } from './IErc20Contract'
import { IErc4626Contract } from './IErc4626Contract'
import type { IFleetConfig, IRebalanceData } from '../types'

/**
 * @name IFleetCommanderContract
 * @description Interface for the FleetCommander contract wrapper
 */
export interface IFleetCommanderContract extends IContractWrapper {
  /** READ METHODS */

  /**
   * @name arks
   * @description Returns the list of available arks
   */
  arks(): Promise<IAddress[]>

  /**
   * @name config
   * @description Returns the configuration of the fleet
   */
  config(): Promise<IFleetConfig>

  /**
   * @name maxDeposit
   * @description Returns the maximum amount of assets that a user can deposit in the fleet at
   *              the current moment
   */
  maxDeposit(params: { user: IAddress }): Promise<ITokenAmount>

  /**
   * @name maxWithdraw
   * @description Returns the maximum amount of assets that a user can withdraw from the fleet at
   *              the current moment
   */
  maxWithdraw(params: { user: IAddress }): Promise<ITokenAmount>

  /** USER WRITE METHODS */

  /**
   * @name deposit
   * @description Deposits an amount of assets into the fleet
   *
   * @param assets The amount of assets to deposit
   * @param receiver The address of the receiver of the shares
   *
   * @returns The transaction information
   */
  deposit(params: { assets: ITokenAmount; receiver: IAddress }): Promise<TransactionInfo>

  /**
   * @name withdraw
   * @description Withdraws an amount of assets from the fleet
   *
   * @param assets The amount of assets to withdraw
   * @param receiver The address of the receiver of the shares
   * @param owner The address of the owner of the shares
   *
   * @returns The transaction information
   */
  withdraw(params: {
    assets: ITokenAmount
    receiver: IAddress
    owner: IAddress
  }): Promise<TransactionInfo>

  /** KEEPERS WRITE METHODS */

  /**
   * @name rebalance
   * @description Rebalances the assets of the fleet. Used by the keepers of the fleet
   *              to move assets between arks
   *
   * @param rebalanceData The data for the rebalance
   *
   * @returns The transaction information
   */
  rebalance(params: { rebalanceData: IRebalanceData[] }): Promise<TransactionInfo>

  /**
   * @name adjustBuffer
   * @description Adjusts the buffer of the fleet. Used by the keepers of the fleet
   *              to move assets between the buffer ark and the main arks
   *
   * @param rebalanceData The data for the rebalance
   *
   * @returns The transaction information
   */
  adjustBuffer(params: { rebalanceData: IRebalanceData[] }): Promise<TransactionInfo>

  /** GOVERNANCE WRITE METHODS */

  /**
   * @name setFleetDepositCap
   * @description Sets the deposit cap of the fleet. Used by the governance
   *
   * @param cap The new deposit cap
   *
   * @returns The transaction information
   */
  setFleetDepositCap(params: { cap: ITokenAmount }): Promise<TransactionInfo>

  /**
   * @name setTipJar
   * @description Sets the tip jar of the fleet. Used by the governance
   *
   * @returns The transaction information
   */
  setTipJar(): Promise<TransactionInfo>

  /**
   * @name setTipRate
   * @description Sets the tip rate of the fleet. Used by the governance
   *
   * @param rate The new tip rate
   *
   * @returns The transaction information
   */
  setTipRate(params: { rate: IPercentage }): Promise<TransactionInfo>

  /**
   * @name addArk
   * @description Adds a new ark to the fleet. Used by the governance
   *
   * @param ark The address of the new ark
   *
   * @returns The transaction information
   */
  addArk(params: { ark: IAddress }): Promise<TransactionInfo>

  /**
   * @name addArks
   * @description Adds a list of new arks to the fleet. Used by the governance
   *
   * @param arks The list of addresses of the new arks
   *
   * @returns The transaction information
   */
  addArks(params: { arks: IAddress[] }): Promise<TransactionInfo>

  /**
   * @name removeArk
   * @description Removes an ark from the fleet. Used by the governance
   *
   * @param ark The address of the ark to remove
   *
   * @returns The transaction information
   */
  removeArk(params: { ark: IAddress }): Promise<TransactionInfo>

  /**
   * @name setArkDepositCap
   * @description Sets the deposit cap of an ark. Used by the governance
   *
   * @param ark The address of the ark
   * @param cap The new deposit cap
   *
   * @returns The transaction information
   */
  setArkDepositCap(params: { ark: IAddress; cap: ITokenAmount }): Promise<TransactionInfo>

  /**
   * @name setArkMaxRebalanceOutflow
   * @description Sets the maximum rebalance outflow of an ark. Used by the governance
   *
   * @param ark The address of the ark
   * @param maxRebalanceOutflow The new maximum rebalance outflow
   *
   * @returns The transaction information
   */
  setArkMaxRebalanceOutflow(params: {
    ark: IAddress
    maxRebalanceOutflow: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setArkMaxRebalanceInflow
   * @description Sets the maximum rebalance inflow of an ark. Used by the governance
   *
   * @param ark The address of the ark
   * @param maxRebalanceInflow The new maximum rebalance inflow
   *
   * @returns The transaction information
   */
  setArkMaxRebalanceInflow(params: {
    ark: IAddress
    maxRebalanceInflow: ITokenAmount
  }): Promise<TransactionInfo>

  /**
   * @name setArkMinimumBufferBalance
   * @description Sets the minimum buffer balance of an ark. Used by the governance
   *
   * @param ark The address of the ark
   * @param minimumBufferBalance The new minimum buffer balance
   *
   * @returns The transaction information
   */
  setMinimumBufferBalance(params: { minimumBufferBalance: ITokenAmount }): Promise<TransactionInfo>

  /**
   * @name setRebalanceCooldown
   * @description Sets the rebalance cooldown of the fleet. Used by the governance
   *
   * @param cooldown The new rebalance cooldown
   *
   * @returns The transaction information
   */
  updateRebalanceCooldown(params: { cooldown: number }): Promise<TransactionInfo>

  /**
   * @name forceRebalance
   * @description Forces a rebalance of the fleet. Used by the governance
   *
   * @param rebalanceData The data for the rebalance
   *
   * @returns The transaction information
   */
  forceRebalance(params: { rebalanceData: IRebalanceData[] }): Promise<TransactionInfo>

  /**
   * @name emergencyShutdown
   * @description Shuts down the fleet in case of an emergency. Used by the governance
   *
   * @returns The transaction information
   */
  emergencyShutdown(): Promise<TransactionInfo>

  /** CASTING METHODS */

  /**
   * @name asErc20
   * @description Returns the contract as an ERC20 contract
   */
  asErc20(): IErc20Contract

  /**
   * @name asErc4626
   * @description Returns the contract as an ERC4626 contract
   */
  asErc4626(): IErc4626Contract
}
