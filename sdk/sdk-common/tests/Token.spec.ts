import { Address, AddressType, ChainIds, ChainInfo } from '../src'
import { Token } from '../src/common/implementation/Token'

describe('SDK Common | Token', () => {
  describe('#createFrom()', () => {
    it('should instantiate with right data', () => {
      const token = Token.createFrom({
        address: Address.createFromEthereum({
          value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        }),
        chainInfo: ChainInfo.createFrom({
          chainId: 1,
          name: 'Ethereum',
        }),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      })

      expect(token.address.value).toEqual('0x0b2c639c533813f4aa9d7837caf62653d097ff85')
      expect(token.address.type).toEqual(AddressType.Ethereum)
      expect(token.chainInfo.chainId).toEqual(1)
      expect(token.chainInfo.name).toEqual('Ethereum')
      expect(token.decimals).toEqual(18)
      expect(token.symbol).toEqual('ETH')
      expect(token.name).toEqual('Ethereum')
    })
  })
  describe('#equals()', () => {
    it('should return true if address, chainId and symbol are the same', () => {
      const token = Token.createFrom({
        address: Address.createFromEthereum({
          value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        }),
        chainInfo: ChainInfo.createFrom({
          chainId: 1,
          name: 'Ethereum',
        }),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      })

      const token2 = Token.createFrom({
        address: Address.createFromEthereum({
          value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        }),
        chainInfo: ChainInfo.createFrom({
          chainId: 1,
          name: 'Ethereum',
        }),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      })

      expect(token.equals(token2)).toBeTruthy()
    })
    it('should return false if address is different', () => {
      const token = Token.createFrom({
        address: Address.createFromEthereum({
          value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        }),
        chainInfo: ChainInfo.createFrom({
          chainId: 1,
          name: 'Ethereum',
        }),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      })

      const token2 = Token.createFrom({
        address: Address.createFromEthereum({
          value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        }),
        chainInfo: ChainInfo.createFrom({
          chainId: 1,
          name: 'Ethereum',
        }),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      })

      expect(token.equals(token2)).toBeFalsy()
    })
    it('should return false if chainId is different', () => {
      const token = Token.createFrom({
        address: Address.createFromEthereum({
          value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        }),
        chainInfo: ChainInfo.createFrom({
          chainId: 1,
          name: 'Ethereum',
        }),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      })

      const token2 = Token.createFrom({
        address: Address.createFromEthereum({
          value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        }),
        chainInfo: ChainInfo.createFrom({
          chainId: ChainIds.ArbitrumOne,
          name: 'SomeChain',
        }),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      })

      expect(token.equals(token2)).toBeFalsy()
    })
  })
  describe('#toString()', () => {
    it('should return a string representation', () => {
      const token = Token.createFrom({
        address: Address.createFromEthereum({
          value: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        }),
        chainInfo: ChainInfo.createFrom({
          chainId: 1,
          name: 'Ethereum',
        }),
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      })

      expect(token.toString()).toEqual('ETH (Ethereum)')
    })
  })
})
