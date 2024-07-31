import { ContractAbi } from '@summerfi/abi-provider-common'
import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IAddress, IChainInfo } from '@summerfi/sdk-common'

/**
 * @name IContractWrapper
 * @description Base interface for all contract wrappers
 */
export interface IContractWrapper {
  /**
   * @name getChainInfo
   * @description Returns the chain information for this wrapper
   */
  get chainInfo(): IChainInfo

  /**
   * @name getAddress
   * @description Returns the address of the contract
   */
  get address(): IAddress

  /**
   * @name getBlockchainProvider
   * @description Returns the blockchain provider associated with the wrapper
   */
  get blockchainClient(): IBlockchainClient

  /**
   * @name getAbi
   * @description Returns the abi of the contract
   * @returns {ContractAbi}
   *
   * @dev This function should be implemented by the child class
   */
  getAbi(): ContractAbi
}
