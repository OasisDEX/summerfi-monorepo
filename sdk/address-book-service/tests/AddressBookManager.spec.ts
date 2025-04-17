import { ChainFamilyMap, AddressType } from '@summerfi/sdk-common'
import { AddressBookManager } from '../src'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { IAddressBookManager } from '@summerfi/address-book-common'
import assert from 'assert'

describe('AddressBookManager', () => {
  const chainInfo = ChainFamilyMap.Ethereum.Mainnet
  let addressBookManager: IAddressBookManager
  const deployments = {
    'Mainnet.standard': {
      chain: 'mainnet',
      config: 'standard',
      date: '',
      provider: 'internal',
      timestamp: 0,
      contracts: {
        CoreContract: {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          blockNumber: '0',
        },
      },
      dependencies: {
        DependencyContract: {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          blockNumber: '0',
        },
      },
    },
  } as DeploymentIndex

  beforeEach(() => {
    addressBookManager = new AddressBookManager({
      deployments: deployments,
      deploymentTag: 'standard',
    })
  })

  it('should return the address of a core contract', async () => {
    const coreContractAddress = await addressBookManager.getAddressByName({
      chainInfo,
      name: 'CoreContract',
    })

    assert(coreContractAddress, 'Address not found')
    expect(coreContractAddress.type).toEqual(AddressType.Ethereum)
    expect(coreContractAddress.value).toEqual('0x6B175474E89094C44Da98b954EedeAC495271d0F')
  })

  it('should return the address of a dependency contract', async () => {
    const dependencyContractAddress = await addressBookManager.getAddressByName({
      chainInfo,
      name: 'DependencyContract',
    })

    assert(dependencyContractAddress, 'Address not found')
    expect(dependencyContractAddress.type).toEqual(AddressType.Ethereum)
    expect(dependencyContractAddress.value).toEqual('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
  })

  it('should return undefined if the name does not exist', async () => {
    const madeUpAddress = await addressBookManager.getAddressByName({
      chainInfo,
      name: 'ReallyMadeUpNameYeah',
    })

    expect(madeUpAddress).toBeUndefined()
  })
})
