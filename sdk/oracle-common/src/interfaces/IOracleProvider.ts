import type { ISpotPricesInfo, FiatCurrency, IChainInfo } from '@summerfi/sdk-common'
import { Denomination, IToken, OracleProviderType, ISpotPriceInfo } from '@summerfi/sdk-common'
import { IManagerProvider } from '@summerfi/sdk-server-common'

/**
 * @name IOracleProvider
 * @description Interface for implementing different oracle provider plugins
 */
export interface IOracleProvider extends IManagerProvider<OracleProviderType> {
  /**
   * @name getSpotPrice
   * @description Returns the prevailing market price for a single token
   * @param baseToken requested base token
   * @param denomination optional denomination either fiat or token, defaults to USD
   */
  getSpotPrice(params: { baseToken: IToken; denomination?: Denomination }): Promise<ISpotPriceInfo>

  /**
   * @name getSpotPrices
   * @description Returns the prevailing market prices for multiple tokens
   * @param chainInfo The chain info for specific chain
   * @param baseTokens An array of requested base tokens
   * @param quote A quote currency, defaults to USD
   */
  getSpotPrices(params: {
    chainInfo: IChainInfo
    baseTokens: IToken[]
    quoteCurrency?: FiatCurrency
  }): Promise<ISpotPricesInfo>
}
