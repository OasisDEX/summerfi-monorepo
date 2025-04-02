import { ChainInfo, FiatCurrency, OracleProviderType, Token } from '@summerfi/sdk-common'
import { Address } from '@summerfi/sdk-common/common'

import { MockOracleProvider } from './mocks/MockOracleProvider'
import { IOracleManager } from '@summerfi/oracle-common'
import { OracleManager } from '../src'

describe('OracleManager', () => {
  let oracleManager: IOracleManager

  const chainInfo = ChainInfo.createFrom({
    chainId: 1,
    name: 'Ethereum',
  })

  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  beforeEach(() => {
    const mockOracleProvider = new MockOracleProvider()
    oracleManager = new OracleManager({
      providers: [mockOracleProvider],
    })
  })

  it('should fetch spot price', async () => {
    const wethSpotPrice = await oracleManager.getSpotPrice({
      baseToken: WETH,
      denomination: FiatCurrency.USD,
    })

    expect(wethSpotPrice).toBeDefined()
    expect(wethSpotPrice.provider).toEqual(OracleProviderType.OneInch)
    expect(wethSpotPrice.token).toEqual(WETH)
    expect(wethSpotPrice.price).toBeDefined()
    expect(wethSpotPrice.price.base).toEqual(WETH)
    expect(wethSpotPrice.price.quote).toEqual(FiatCurrency.USD)
    expect(wethSpotPrice.price.value).toBeDefined()
    expect(Number(wethSpotPrice.price.value)).toBeGreaterThanOrEqual(0)
  })
})
