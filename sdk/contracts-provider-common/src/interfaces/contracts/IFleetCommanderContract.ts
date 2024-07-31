import { IAddress, ITokenAmount, TransactionInfo } from '@summerfi/sdk-common'
import { IArkConfiguration } from './IArkConfiguration'
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
   * @description Returns the configuration for one ark
   */
  arks(params: { address: IAddress }): Promise<IArkConfiguration>

  /** WRITE METHODS */

  /**
   * @name deposit
   * @description Deposits an amount of assets into the FleetCommander contract
   * @param assets The amount of assets to deposit
   * @param receiver The address of the receiver of the shares
   */
  deposit(params: { assets: ITokenAmount; receiver: IAddress }): Promise<TransactionInfo>

  /**
   * @name withdraw
   * @description Deposits an amount of assets into the FleetCommander contract
   * @param assets The amount of assets to deposit
   * @param receiver The address of the receiver of the shares
   * @param owner The address of the owner of the shares
   */
  withdraw(params: {
    assets: ITokenAmount
    receiver: IAddress
    owner: IAddress
  }): Promise<TransactionInfo>

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
