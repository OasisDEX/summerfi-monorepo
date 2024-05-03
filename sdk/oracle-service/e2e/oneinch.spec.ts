import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { Address, CurrencySymbol, Token, type ChainInfo } from '@summerfi/sdk-common/common'

import { OracleManagerFactory } from '../src/implementation/OracleManagerFactory'
import { ChainFamilyMap, OracleProviderType, SpotPriceInfo } from '@summerfi/sdk-common'

describe('OneInch | OracleManager | Integration', () => {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  // Tokens
  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  it('should provide spot prices', async () => {
    // SwapManager
    const configProvider = new ConfigurationProvider()
    const oracleManager = OracleManagerFactory.newOracleManager({ configProvider })

    const spotPriceInfo: SpotPriceInfo = await oracleManager.getSpotPrice({
      chainInfo,
      baseToken: WETH,
      quoteToken: CurrencySymbol.USD,
      forceUseProvider: OracleProviderType.OneInch,
    })

    expect(spotPriceInfo).toBeDefined()
    expect(spotPriceInfo.provider).toEqual(OracleProviderType.OneInch)
    expect(spotPriceInfo.token).toEqual(WETH)
    expect(spotPriceInfo.price).toBeDefined()
    expect(spotPriceInfo.price.baseToken).toEqual(WETH)
    expect(spotPriceInfo.price.quoteToken).toEqual(CurrencySymbol.USD)
    expect(spotPriceInfo.price.value).toBeDefined()
    expect(Number(spotPriceInfo.price.value)).toBeGreaterThanOrEqual(0)
  })
})
