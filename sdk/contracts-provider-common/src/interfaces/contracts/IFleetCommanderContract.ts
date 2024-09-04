import { IRebalanceData } from '@summerfi/armada-protocol-common'
import { IAddress, ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'
import { IErc20Contract } from './IErc20Contract'
import { IErc4626Contract } from './IErc4626Contract'

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
   * @name depositCap
   * @description Returns the deposit cap of the fleet, this is the maximum amount of assets that
   *              the fleet can manage, and therefore the maximum amount of assets that can be deposited
   *              in total by all users
   */
  depositCap(): Promise<ITokenAmount>

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
   * @description Deposits an amount of assets into the FleetCommander contract
   *
   * @param assets The amount of assets to deposit
   * @param receiver The address of the receiver of the shares
   *
   * @returns The transaction information
   */
  deposit(params: { assets: ITokenAmount; receiver: IAddress }): Promise<TransactionInfo>

  /**
   * @name withdraw
   * @description Deposits an amount of assets into the FleetCommander contract
   *
   * @param assets The amount of assets to deposit
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
