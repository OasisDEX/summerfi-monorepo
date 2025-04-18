import { IAddressBookManager } from '@summerfi/address-book-common'
import { AddressValue, ChainId, IChainInfo, Address, IAddress, Maybe } from '@summerfi/sdk-common'
import assert from 'assert'

export class AddressBookManagerMock implements IAddressBookManager {
  public addressBook: Map<ChainId, Map<string, AddressValue>>

  constructor() {
    this.addressBook = new Map<ChainId, Map<string, AddressValue>>()
  }

  setAddressByName(params: { chainInfo: IChainInfo; name: string; address: AddressValue }) {
    if (!this.addressBook.has(params.chainInfo.chainId)) {
      this.addressBook.set(params.chainInfo.chainId, new Map<string, AddressValue>())
    }
    const addressMap = this.addressBook.get(params.chainInfo.chainId)
    assert(addressMap)

    addressMap.set(params.name, params.address)
  }

  async getAddressByName(params: {
    chainInfo: IChainInfo
    name: string
  }): Promise<Maybe<IAddress>> {
    const addressMap = this.addressBook.get(params.chainInfo.chainId)
    if (addressMap) {
      const addressValue = addressMap.get(params.name)
      if (addressValue) {
        return Address.createFromEthereum({ value: addressValue })
      }
    }
    return Address.createFromEthereum({
      value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    })
  }
}
