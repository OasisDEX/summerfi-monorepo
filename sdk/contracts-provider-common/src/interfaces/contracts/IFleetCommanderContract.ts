import { IAddress } from '@summerfi/sdk-common'
import { IArkConfiguration } from './IArkConfiguration'
import { IContractWrapper } from './IContractWrapper'
import { IErc20Contract } from './IErc20Contract'
import { IErc4626Contract } from './IErc4626Contract'

/**
 * @name IFleetCommanderContract
 * @description Interface for the FleetCommander contract wrapper
 */
export interface IFleetCommanderContract extends IContractWrapper {
  /**
   * @name arks
   * @description Returns the configuration for one ark
   */
  arks(params: { address: IAddress }): Promise<IArkConfiguration>

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
