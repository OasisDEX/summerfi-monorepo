import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainInfo, Address, AddressType } from '@summerfi/sdk-common'
import { ITokensProvider } from '@summerfi/tokens-common'
import assert from 'assert'
import { StaticTokensProvider } from '../src/implementation/static/StaticTokensProvider'

describe('StaticTokensProvider', () => {
  let staticTokensProvider: ITokensProvider

  const chainInfo = ChainInfo.createFrom({
    chainId: 1,
    name: 'Ethereum',
  })

  beforeEach(() => {
    staticTokensProvider = new StaticTokensProvider({
      configProvider: {} as IConfigurationProvider,
    })
  })
  it('should return supported chain IDs', async () => {
    const chainIds = staticTokensProvider.getSupportedChainIds()
    expect(chainIds.length).toBeGreaterThan(0)
    expect(chainIds).toContain(1)
  })
  it('should return token by symbol', async () => {
    const wethToken = await staticTokensProvider.getTokenBySymbol({
      chainInfo,
      symbol: 'WETH',
    })

    assert(wethToken, 'Token not found')
    expect(wethToken.chainInfo).toEqual(chainInfo)
    expect(wethToken.symbol).toBe('WETH')
    expect(wethToken.name).toBe('Wrapped Ether')
    expect(wethToken.decimals).toBe(18)
    expect(wethToken.address.value).toBe('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')

    const daiToken = await staticTokensProvider.getTokenBySymbol({
      chainInfo,
      symbol: 'DAI',
    })

    assert(daiToken, 'Token not found')
    expect(daiToken.chainInfo).toEqual(chainInfo)
    expect(daiToken.symbol).toBe('DAI')
    expect(daiToken.name).toBe('Dai Stablecoin')
    expect(daiToken.decimals).toBe(18)
    expect(daiToken.address.value).toBe('0x6B175474E89094C44Da98b954EedeAC495271d0F')
  })
  it('should return token by address', async () => {
    const wethToken = await staticTokensProvider.getTokenByAddress({
      chainInfo,
      address: Address.createFrom({
        value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        type: AddressType.Ethereum,
      }),
    })

    assert(wethToken, 'Token not found')
    expect(wethToken.chainInfo).toEqual(chainInfo)
    expect(wethToken.symbol).toBe('WETH')
    expect(wethToken.name).toBe('Wrapped Ether')
    expect(wethToken.decimals).toBe(18)
    expect(wethToken.address.value).toBe('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')

    const daiToken = await staticTokensProvider.getTokenByAddress({
      chainInfo,
      address: Address.createFrom({
        value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        type: AddressType.Ethereum,
      }),
    })

    assert(daiToken, 'Token not found')
    expect(daiToken.chainInfo).toEqual(chainInfo)
    expect(daiToken.symbol).toBe('DAI')
    expect(daiToken.name).toBe('Dai Stablecoin')
    expect(daiToken.decimals).toBe(18)
    expect(daiToken.address.value).toBe('0x6B175474E89094C44Da98b954EedeAC495271d0F')
  })
  it('should return token by name', async () => {
    const wethToken = await staticTokensProvider.getTokenByName({
      chainInfo,
      name: 'Wrapped Ether',
    })

    assert(wethToken, 'Token not found')
    expect(wethToken.chainInfo).toEqual(chainInfo)
    expect(wethToken.symbol).toBe('WETH')
    expect(wethToken.name).toBe('Wrapped Ether')
    expect(wethToken.decimals).toBe(18)
    expect(wethToken.address.value).toBe('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')

    const daiToken = await staticTokensProvider.getTokenByName({
      chainInfo,
      name: 'Dai Stablecoin',
    })

    assert(daiToken, 'Token not found')
    expect(daiToken.chainInfo).toEqual(chainInfo)
    expect(daiToken.symbol).toBe('DAI')
    expect(daiToken.name).toBe('Dai Stablecoin')
    expect(daiToken.decimals).toBe(18)
    expect(daiToken.address.value).toBe('0x6B175474E89094C44Da98b954EedeAC495271d0F')
  })
})
