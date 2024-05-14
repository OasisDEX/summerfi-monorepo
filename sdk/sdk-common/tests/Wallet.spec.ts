import { Address, AddressType, Wallet } from '../src'

describe('SDK Common | Wallet', () => {
  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const wallet = Wallet.createFrom({
        address: Address.createFromEthereum({
          value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        }),
      })

      expect(wallet.address.value).toEqual('0x0b2c639c533813f4aa9d7837caf62653d097ff85')
      expect(wallet.address.type).toEqual(AddressType.Ethereum)
    })
  })

  describe('#toString()', () => {
    it('should return the stringified address', () => {
      const wallet = Wallet.createFrom({
        address: Address.createFromEthereum({
          value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        }),
      })

      expect(wallet.toString()).toEqual(
        'Wallet: 0x0b2c639c533813f4aa9d7837caf62653d097ff85 (Ethereum)',
      )
    })
  })
})
