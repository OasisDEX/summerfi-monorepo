import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { Address, Token, type ChainInfo } from '@summerfi/sdk-common/common'

import { OracleManagerFactory } from '../src/implementation/OracleManagerFactory'
import {
  ChainFamilyMap,
  FiatCurrency,
  OracleProviderType,
  ISpotPriceInfo,
} from '@summerfi/sdk-common'

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

    const spotPriceInfo: ISpotPriceInfo = await oracleManager.getSpotPrice({
      baseToken: WETH,
      quoteToken: FiatCurrency.USD,
      forceUseProvider: OracleProviderType.OneInch,
    })

    expect(spotPriceInfo).toBeDefined()
    expect(spotPriceInfo.provider).toEqual(OracleProviderType.OneInch)
    expect(spotPriceInfo.token).toEqual(WETH)
    expect(spotPriceInfo.price).toBeDefined()
    expect(spotPriceInfo.price.base).toEqual(WETH)
    expect(spotPriceInfo.price.quote).toEqual(FiatCurrency.USD)
    expect(spotPriceInfo.price.value).toBeDefined()
    expect(Number(spotPriceInfo.price.value)).toBeGreaterThanOrEqual(0)
  })
})
