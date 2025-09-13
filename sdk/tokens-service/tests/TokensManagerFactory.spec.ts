import { ChainInfo, Address, AddressType } from '@summerfi/sdk-common'
import { ITokensManager } from '@summerfi/tokens-common'
import assert from 'assert'

import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { TokensManagerFactory } from '../src'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'

describe('TokensManagerFactory', () => {
  let tokensManager: ITokensManager

  const chainInfo = ChainInfo.createFrom({
    chainId: 1,
    name: 'Ethereum',
  })

  beforeEach(() => {
    tokensManager = TokensManagerFactory.newTokensManager({
      configProvider: {} as IConfigurationProvider,
      blockchainClientProvider: {} as IBlockchainClientProvider,
    })
  })

  it('should return token by symbol', async () => {
    const wethToken = await tokensManager.getTokenBySymbol({
      chainInfo,
      symbol: 'WETH',
    })

    assert(wethToken, 'Token not found')
    expect(wethToken.chainInfo).toEqual(chainInfo)
    expect(wethToken.symbol).toBe('WETH')
    expect(wethToken.name).toBe('Wrapped Ether')
    expect(wethToken.decimals).toBe(18)
    expect(wethToken.address.value).toBe('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')

    const daiToken = await tokensManager.getTokenBySymbol({
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
    const wethToken = await tokensManager.getTokenByAddress({
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

    const daiToken = await tokensManager.getTokenByAddress({
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
    const wethToken = await tokensManager.getTokenByName({
      chainInfo,
      name: 'Wrapped Ether',
    })

    assert(wethToken, 'Token not found')
    expect(wethToken.chainInfo).toEqual(chainInfo)
    expect(wethToken.symbol).toBe('WETH')
    expect(wethToken.name).toBe('Wrapped Ether')
    expect(wethToken.decimals).toBe(18)
    expect(wethToken.address.value).toBe('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')

    const daiToken = await tokensManager.getTokenByName({
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
