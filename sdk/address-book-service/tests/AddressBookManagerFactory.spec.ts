import { IAddressBookManager } from '@summerfi/address-book-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainFamilyMap, AddressType } from '@summerfi/sdk-common'
import { AddressBookManagerFactory } from '../src'

import assert from 'assert'

describe('TokensManagerFactory', () => {
  let addressBookManager: IAddressBookManager

  const chainInfo = ChainFamilyMap.Ethereum.Mainnet

  beforeEach(() => {
    addressBookManager = AddressBookManagerFactory.newAddressBookManager({
      configProvider: {} as IConfigurationProvider,
    })
  })

  it('should return the address of a core contract', async () => {
    const operationExecutorAddress = await addressBookManager.getAddressByName({
      chainInfo,
      name: 'OperationExecutor',
    })

    assert(operationExecutorAddress, 'Address not found')
    expect(operationExecutorAddress.type).toEqual(AddressType.Ethereum)
  })

  it('should return the address of a dependency contract', async () => {
    const morphoBlueAddress = await addressBookManager.getAddressByName({
      chainInfo,
      name: 'MorphoBlue',
    })

    assert(morphoBlueAddress, 'Address not found')
    expect(morphoBlueAddress.type).toEqual(AddressType.Ethereum)
  })

  it('should return undefined if the name does not exist', async () => {
    const madeUpAddress = await addressBookManager.getAddressByName({
      chainInfo,
      name: 'ReallyMadeUpNameYeah',
    })

    expect(madeUpAddress).toBeUndefined()
  })
})
