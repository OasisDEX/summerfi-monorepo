import { IOracleProvider } from '@summerfi/oracle-common'
import {
  ChainId,
  Denomination,
  FiatCurrency,
  OracleProviderType,
  Price,
  SpotPriceInfo,
} from '@summerfi/sdk-common'
import { IToken } from '@summerfi/sdk-common/common'

export class MockOracleProvider implements IOracleProvider {
  type: OracleProviderType = OracleProviderType.OneInch

  getSupportedChainIds(): ChainId[] {
    return [1, 4, 6]
  }

  async getSpotPrice(params: {
    baseToken: IToken
    quoteToken?: Denomination
  }): Promise<SpotPriceInfo> {
    return {
      provider: this.type,
      token: params.baseToken,
      price: Price.createFrom({
        base: params.baseToken,
        quote: FiatCurrency.USD,
        value: '1000',
      }),
    }
  }
}
