import type { Maybe, IChainInfo, IAddress } from '@summerfi/sdk-common'

/**
 * @name IAddressBookManager
 * @description Interface for the IAddressBookManager. Allows to retrieve the address of a contract
 *              in a certain Chain by its address. It is used to retrieve the addresses of the
 *              Summer deployments but also to retrieve the addresses of the dependencies of the
 *              Summer system
 *
 * NOTICE: For tokens you should use the ITokensManager instead
 */
export interface IAddressBookManager {
  /**
   * @method getAddressByName
   * @description Retrieves the address of a contract by its name
   *
   * @param chainInfo The chain information of the token to retrieve
   * @param name The name of the contract to retrieve
   *
   * @returns The address of the contract with the given name
   */
  getAddressByName(params: { chainInfo: IChainInfo; name: string }): Promise<Maybe<IAddress>>
}
