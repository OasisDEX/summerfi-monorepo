import type {
  ISpotPriceInfo,
  SpotPricesInfo,
  IToken,
  Denomination,
  FiatCurrency,
  IChainInfo,
} from '@summerfi/sdk-common'

/**
 * Interface for the Oracle Manager client implementation.
 *
 * @see IOracleManager
 */
export interface IOracleManagerClient {
  /**
   * Returns the prevailing market price for a single token
   *
   * @param params.baseToken requested base token
   * @param params.denomination optional denomination either fiat or token, defaults to USD
   */
  getSpotPrice(params: { baseToken: IToken; denomination?: Denomination }): Promise<ISpotPriceInfo>

  /**
   * Returns the prevailing market prices for multiple tokens
   *
   * @param params.chainInfo The chain info for specific chain
   * @param params.baseTokens An array of requested base tokens
   * @param params.quoteCurrency A quote currency, defaults to USD
   */
  getSpotPrices(params: {
    chainInfo: IChainInfo
    baseTokens: IToken[]
    quoteCurrency?: FiatCurrency
  }): Promise<SpotPricesInfo>
}
