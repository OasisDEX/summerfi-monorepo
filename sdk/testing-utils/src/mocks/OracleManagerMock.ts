import { IChainInfo, IToken } from '@summerfi/sdk-common'
import { SpotPriceInfo } from '@summerfi/sdk-common/oracle'
import { IOracleManager } from '@summerfi/oracle-common'

export class OracleManagerMock implements IOracleManager {
  private _spotDataReturnValue: SpotPriceInfo = {} as SpotPriceInfo

  setSpotPrice(spotPrice: SpotPriceInfo): void {
    this._spotDataReturnValue = spotPrice
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSpotPrice(params: { chainInfo: IChainInfo; baseToken: IToken }): Promise<SpotPriceInfo> {
    return this._spotDataReturnValue
  }
}
