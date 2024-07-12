import { ITokenAmount } from '@summerfi/sdk-common'
import { IContractWrapper } from './IContractWrapper'
import { IErc20Contract } from './IErc20Contract'

/**
 * @name IErc4626Contract
 * @description Interface for the ERC4626 contract wrapper
 */
export interface IErc4626Contract extends IContractWrapper {
  /**
   * @name totalAssets
   * @description Returns the total number of assets available in the vault
   */
  totalAssets(): Promise<ITokenAmount>

  /**
   * @name asErc20
   * @description Returns the contract as an ERC20 contract
   */
  asErc20(): IErc20Contract
}
