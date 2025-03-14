import {
  Denomination,
  IToken,
  type FiatCurrency,
  type IChainInfo,
} from '@summerfi/sdk-common/common'
import { OracleProviderType, SpotPriceInfo, type SpotPricesInfo } from '@summerfi/sdk-common/oracle'
import { IManagerProvider } from '@summerfi/sdk-server-common'

/**
 * @name IOracleProvider
 * @description Interface for implementing different oracle provider plugins
 */
export interface IOracleProvider extends IManagerProvider<OracleProviderType> {
  /**
   * @name getSpotPrice
   * @description Returns the prevailing market price for a given asset
   *              in terms of a base currency
   * @param baseToken A price request for baseToken
   * @param quoteToken A price request - QuoteToken is optional with a USD default.
   */
  getSpotPrice(params: { baseToken: IToken; quoteToken?: Denomination }): Promise<SpotPriceInfo>

  /**
   * @name getSpotPrices
   * @description Returns the prevailing market price for a given asset
   *              in terms of a base currency
   * @param baseToken A price request for baseToken
   * @param quoteTokens A price request for multiple quoteTokens
   */
  getSpotPrices(params: {
    chainInfo: IChainInfo
    baseTokens: IToken[]
    quote: FiatCurrency
  }): Promise<SpotPricesInfo>
}
