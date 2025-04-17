import type { Maybe } from '@summerfi/sdk-common'
import { isToken, OracleProviderType } from '@summerfi/sdk-common'
import { IOracleManager, IOracleProvider } from '@summerfi/oracle-common'
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
  async getSpotPrice(
    params: Parameters<IOracleManager['getSpotPrice']>[0],
  ): ReturnType<IOracleManager['getSpotPrice']> {
    if (
      params.denomination &&
      isToken(params.denomination) &&
      !params.baseToken.chainInfo.equals(params.denomination.chainInfo)
    ) {
      throw new Error('Base token and quote token must be on the same chain')
    }

    const provider: Maybe<IOracleProvider> = this._getBestProvider({
      chainInfo: params.baseToken.chainInfo,
      forceUseProvider: params.forceUseProvider,
    })
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSpotPrice(params)
  }

  /** @see IOracleManager.getSpotPrices */
  async getSpotPrices(
    params: Parameters<IOracleManager['getSpotPrices']>[0],
  ): ReturnType<IOracleManager['getSpotPrices']> {
    if (params.baseTokens) {
      for (const baseToken of params.baseTokens) {
        if (!isToken(baseToken) || !params.chainInfo.equals(baseToken.chainInfo)) {
          throw new Error('All Base tokens must be on the same chain')
        }
      }
    }

    const provider: Maybe<IOracleProvider> = this._getBestProvider({
      chainInfo: params.chainInfo,
    })
    if (!provider) {
      throw new Error('No swap provider available')
    }

    return provider.getSpotPrices(params)
  }
}
