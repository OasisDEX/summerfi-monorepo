import { ChainId, ChainInfo, Token } from '@summerfi/sdk-common/common'
import { CurrencySymbol } from '@summerfi/sdk-common/common'
import { OracleProviderType, SpotPriceInfo } from '@summerfi/sdk-common/oracle'

/**
 * @name IOracleProvider
 * @description Interface for implementing different oracle provider plugins
 */
export interface IOracleProvider {
  /**
   * @name type
   * @description The type of the oracle provider, to identify it
   */
  type: OracleProviderType

  /**
   * @method getSupportedChainIds
   * @description Retrieves the list of supported chain IDs
   * @returns The list of supported chain IDs
   */
  getSupportedChainIds(): ChainId[]

  /**
   * @name getSpotPrice
   * @description Returns the prevailing market price for a given asset
   *              in terms of a base currency
   * @param chainInfo The chain information
   * @param baseToken A price request for baseToken
   * @param quoteToken A price request - QuoteToken is optional with a USD default.
   */
  getSpotPrice(params: {
    chainInfo: ChainInfo
    baseToken: Token
    quoteToken?: CurrencySymbol | Token
  }): Promise<SpotPriceInfo>
}
