import { IAddress, IChainInfo } from '@summerfi/sdk-common'
import { IErc20Contract } from './contracts/IErc20Contract'
import { IErc4626Contract } from './contracts/IErc4626Contract'
import { IFleetCommanderContract } from './contracts/IFleetCommanderContract'
import { IProtocolAccessManagerWhiteListContract } from './contracts/IProtocolAccessManagerWhiteListContract'

/**
 * @name IContractsProvider
 * @description Offers a set of methods to retrieve specific contract wrappers that allow to interact
 *              with their respective smart contracts.
 *
 * @dev         The returned wrapper allows to read directly from the smart contract through the view functions.
 *              It also allows to generate calldata for the write functions, but it is not capable of sending a
 *              transaction to the network. The generated calldata can be returned to the SDK client so it can
 *              be used to send the transaction through a wallet
 */
export interface IContractsProvider {
  /**
   * @name getErc20Contract
   * @description Returns an ERC20 contract wrapper
   *
   * @param {IChainInfo} chainInfo The chain information where the contract is deployed
   * @param {IAddress} address The address of the ERC20 contract
   *
   * @returns {IErc20Contract}
   */
  getErc20Contract(params: { chainInfo: IChainInfo; address: IAddress }): Promise<IErc20Contract>

  /**
   * @name getErc4626Contract
   * @description Returns an ERC4626 contract wrapper
   *
   * @param {IChainInfo} chainInfo The chain information where the contract is deployed
   * @param {IAddress} address The address of the ERC4626 contract
   *
   * @returns {IErc4626Contract}
   */
  getErc4626Contract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<IErc4626Contract>

  /**
   * @name getFleetCommanderContract
   * @description Returns a FleetCommander contract wrapper
   *
   * @param {IChainInfo} chainInfo The chain information where the contract is deployed
   * @param {IAddress} address The address of the FleetCommander contract
   *
   * @returns {IFleetCommanderContract}
   */
  getFleetCommanderContract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<IFleetCommanderContract>

  /**
   * @name getProtocolAccessManagerWhiteListContract
   * @description Returns a ProtocolAccessManagerWhiteList contract wrapper
   *
   * @param {IChainInfo} chainInfo The chain information where the contract is deployed
   * @param {IAddress} address The address of the ProtocolAccessManagerWhiteList contract
   *
   * @returns {IProtocolAccessManagerWhiteListContract}
   */
  getProtocolAccessManagerWhiteListContract(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<IProtocolAccessManagerWhiteListContract>
}
