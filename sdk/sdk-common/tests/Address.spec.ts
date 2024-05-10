import { AddressType } from '../src/common/enums/AddressType'
import { Address } from '../src/common/implementation/Address'

describe('SDK Common | Address', () => {
  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const address = Address.createFrom({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        type: AddressType.Ethereum,
      })

      expect(address.value).toEqual('0x0b2c639c533813f4aa9d7837caf62653d097ff85')
      expect(address.type).toEqual(AddressType.Ethereum)

      const baseAddress = Address.createFrom({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        type: AddressType.Unknown,
      })

      expect(baseAddress.value).toEqual('0x0b2c639c533813f4aa9d7837caf62653d097ff85')
      expect(baseAddress.type).toEqual(AddressType.Unknown)
    })

    it('should throw if the address format is invalid', () => {
      expect(() =>
        Address.createFrom({
          value: '0xAAA',
          type: AddressType.Ethereum,
        }),
      ).toThrow()
    })
  })
  describe('#createFromEthereum()', () => {
    it('should instantiate with right data', () => {
      const address = Address.createFromEthereum({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      })

      expect(address.value).toEqual('0x0b2c639c533813f4aa9d7837caf62653d097ff85')
      expect(address.type).toEqual(AddressType.Ethereum)
    })
  })
  describe('#isValid()', () => {
    it('should return true if address is valid', () => {
      expect(Address.isValid('0x0b2c639c533813f4aa9d7837caf62653d097ff85')).toBeTruthy()
    })
    it('should return false if address is invalid', () => {
      expect(Address.isValid('0x0b2c639c533813f4aa9d7837caf62653d097ff8')).toBeFalsy()
    })
  })
  describe('#getType()', () => {
    it('should return Ethereum if address is valid', () => {
      expect(Address.getType('0x0b2c639c533813f4aa9d7837caf62653d097ff85')).toEqual(
        AddressType.Ethereum,
      )
    })
    it('should return Unknown if address is invalid', () => {
      expect(Address.getType('Acb23498923898348BCA3409234923490')).toEqual(AddressType.Unknown)
    })
  })
  describe('#equals()', () => {
    it('should return true if value is the same', () => {
      const address = Address.createFrom({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        type: AddressType.Ethereum,
      })

      const address2 = Address.createFrom({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        type: AddressType.Ethereum,
      })

      expect(address.equals(address2)).toBeTruthy()
    })
    it('should return false if value is different', () => {
      const address = Address.createFrom({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        type: AddressType.Ethereum,
      })

      const address2 = Address.createFrom({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff86',
        type: AddressType.Unknown,
      })

      expect(address.equals(address2)).toBeFalsy()

      const address3 = Address.createFrom({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        type: AddressType.Unknown,
      })

      expect(address.equals(address3)).toBeFalsy()
    })
  })
  describe('#toString()', () => {
    it('should return a string representation', () => {
      const address = Address.createFrom({
        value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        type: AddressType.Ethereum,
      })

      expect(address.toString()).toEqual('0x0b2c639c533813f4aa9d7837caf62653d097ff85 (Ethereum)')
    })
  })
})
