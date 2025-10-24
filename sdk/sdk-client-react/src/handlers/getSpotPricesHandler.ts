import type { ISDKAdminManager, ISDKManager } from '@summerfi/sdk-client'
import { type FiatCurrency, type IToken, type IChainInfo } from '@summerfi/sdk-common'

export const getSpotPricesHandler =
  (sdk: ISDKManager | ISDKAdminManager) =>
  async ({
    chainInfo,
    baseTokens,
    quoteCurrency,
  }: {
    chainInfo: IChainInfo
    baseTokens: IToken[]
    quoteCurrency?: FiatCurrency
  }) => {
    const position = await sdk.oracle.getSpotPrices({
      chainInfo,
      baseTokens,
      quoteCurrency,
    })
    return position
  }
