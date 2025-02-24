import { IToken, OracleProviderType } from '@summerfi/sdk-common'
import { SpotPriceInfo, type SpotPricesInfo } from '@summerfi/sdk-common/oracle'
import { IOracleManager, IOracleProvider } from '@summerfi/oracle-common'
import { ManagerWithProvidersBase } from '@summerfi/sdk-server-common'

export class OracleManagerMock
  extends ManagerWithProvidersBase<OracleProviderType, IOracleProvider>
  implements IOracleManager
{
  private _spotDataReturnValue: SpotPriceInfo = {} as SpotPriceInfo

  constructor() {
    super({
      providers: [],
    })
  }

  setSpotPrice(spotPrice: SpotPriceInfo): void {
    this._spotDataReturnValue = spotPrice
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSpotPrice(params: { baseToken: IToken }): Promise<SpotPriceInfo> {
    return this._spotDataReturnValue
  }

  async getSpotPrices(): Promise<SpotPricesInfo> {
    return {} as SpotPricesInfo
  }
}
