import { IAddressBookManager } from '@summerfi/address-book-common'
import { IAddress, IChainInfo } from '@summerfi/sdk-common'

/**
 * Utility function to retrieve contract addresses
 *
 * @param addressBookManager Address book manager to look the address up
 * @param chainInfo The chain where the contract is deployed
 * @param contractName The name of the contract
 *
 * @returns The address of the contract or throws if not found
 */
export async function getContractAddress(params: {
  addressBookManager: IAddressBookManager
  chainInfo: IChainInfo
  contractName: string
}): Promise<IAddress> {
  const { addressBookManager, chainInfo, contractName } = params

  const contractAddress = await addressBookManager.getAddressByName({
    chainInfo: chainInfo,
    name: contractName,
  })

  if (!contractAddress) {
    throw new Error(
      `Cannot find the address of the ${contractName} contract for the chain ${chainInfo}`,
    )
  }

  return contractAddress
}
