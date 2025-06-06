import type { ISDKManager } from '@summer_fi/sdk-client'
import { type FiatCurrency, type IToken, type IChainInfo } from '@summer_fi/sdk-client'

export const getSpotPricesHandler =
  (sdk: ISDKManager) =>
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
