import { IOracleProvider } from '@summerfi/oracle-common'
import {
  ChainId,
  ChainInfo,
  CurrencySymbol,
  OracleProviderType,
  Price,
  SpotPriceInfo,
} from '@summerfi/sdk-common'
import { Token } from '@summerfi/sdk-common/common'

export class MockOracleProvider implements IOracleProvider {
  type: OracleProviderType = OracleProviderType.OneInch

  getSupportedChainIds(): ChainId[] {
    return [1, 4, 6]
  }

  async getSpotPrice(params: {
    chainInfo: ChainInfo
    baseToken: Token
    quoteToken?: CurrencySymbol | Token
  }): Promise<SpotPriceInfo> {
    return {
      provider: this.type,
      token: params.baseToken,
      price: Price.createFrom({
        baseToken: params.baseToken,
        quoteToken: CurrencySymbol.USD,
        value: '1000',
      }),
    }
  }
}
