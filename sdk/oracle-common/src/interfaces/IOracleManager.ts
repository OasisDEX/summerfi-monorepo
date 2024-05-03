import type { CurrencySymbol, IToken, IChainInfo } from '@summerfi/sdk-common/common'
import type { SpotPriceInfo } from '@summerfi/sdk-common/oracle'

/**
 * @name IOracleManager
 * @description This is the highest level interface that will choose and call appropriate provider for a price consultation
 */
export interface IOracleManager {
  /**
   * @name getSpotPrice
   * @description Returns the prevailing market price for a given asset
   *              in terms of a base currency
   * @param chainInfo The chain information
   * @param baseToken A price request for baseToken
   * @param quoteToken A price request - QuoteToken is optional with a USD default.
   */
  getSpotPrice(params: {
    chainInfo: IChainInfo
    baseToken: IToken
    quoteToken?: CurrencySymbol | IToken
  }): Promise<SpotPriceInfo>
}
