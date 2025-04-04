import { IToken, OracleProviderType } from '@summerfi/sdk-common'
import { ISpotPriceInfo, type SpotPricesInfo } from '@summerfi/sdk-common/oracle'
import { IOracleManager, IOracleProvider } from '@summerfi/oracle-common'
import { ManagerWithProvidersBase } from '@summerfi/sdk-server-common'

export class OracleManagerMock
  extends ManagerWithProvidersBase<OracleProviderType, IOracleProvider>
  implements IOracleManager
{
  private _spotDataReturnValue: ISpotPriceInfo = {} as ISpotPriceInfo

  constructor() {
    super({
      providers: [],
    })
  }

  setSpotPrice(spotPrice: ISpotPriceInfo): void {
    this._spotDataReturnValue = spotPrice
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSpotPrice(params: { baseToken: IToken }): Promise<ISpotPriceInfo> {
    return this._spotDataReturnValue
  }

  async getSpotPrices(): Promise<SpotPricesInfo> {
    return {} as SpotPricesInfo
  }
}
