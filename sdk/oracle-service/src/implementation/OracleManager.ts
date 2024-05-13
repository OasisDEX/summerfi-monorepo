import type { Denomination, Maybe } from '@summerfi/sdk-common/common/aliases'
import type { IToken } from '@summerfi/sdk-common/common'
import { isToken } from '@summerfi/sdk-common/common'
import { IOracleManager, IOracleProvider } from '@summerfi/oracle-common'
import { OracleProviderType, SpotPriceInfo } from '@summerfi/sdk-common/oracle'
import { ManagerWithProvidersBase } from '@summerfi/sdk-server-common'

export type OracleManagerProviderConfig = {
  provider: IOracleProvider
}

/**
 * @name OracleManager
 * @description This class is the implementation of the IOracleManager interface. Takes care of choosing the best provider for a price consultation
 */
export class OracleManager
  extends ManagerWithProvidersBase<OracleProviderType, IOracleProvider>
  implements IOracleManager
{
  /** CONSTRUCTOR */

  constructor(params: { providers: IOracleProvider[] }) {
    super(params)
  }

  /** @see IOracleManager.getSpotPrice */
  async getSpotPrice(params: {
    baseToken: IToken
    quoteToken?: Denomination
    forceUseProvider?: OracleProviderType
  }): Promise<SpotPriceInfo> {
    if (
      params.quoteToken &&
      isToken(params.quoteToken) &&
      !params.baseToken.chainInfo.equals(params.quoteToken.chainInfo)
    ) {
      throw new Error('Base token and quote token must be on the same chain')
    }

    const provider: Maybe<IOracleProvider> = this.getBestProvider({
      chainInfo: params.baseToken.chainInfo,
      forceUseProvider: params.forceUseProvider,
    })
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSpotPrice(params)
  }
}
