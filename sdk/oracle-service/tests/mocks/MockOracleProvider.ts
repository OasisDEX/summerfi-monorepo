import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { IOracleProvider } from '@summerfi/oracle-common'
import {
  ChainId,
  Denomination,
  FiatCurrency,
  OracleProviderType,
  Price,
  ISpotPriceInfo,
  IToken,
} from '@summerfi/sdk-common'
import type { SpotPricesInfo } from '@summerfi/sdk-common'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'

export class MockOracleProvider
  extends ManagerProviderBase<OracleProviderType>
  implements IOracleProvider
{
  constructor() {
    super({
      configProvider: undefined as unknown as IConfigurationProvider,
      type: OracleProviderType.OneInch,
    })
  }

  getSupportedChainIds(): ChainId[] {
    return [1]
  }

  async getSpotPrice(params: {
    baseToken: IToken
    denomination?: Denomination
  }): Promise<ISpotPriceInfo> {
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

  async getSpotPrices(): Promise<SpotPricesInfo> {
    return {} as SpotPricesInfo
  }
}
