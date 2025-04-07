import type { IToken, Denomination, IChainInfo, FiatCurrency } from '@summerfi/sdk-common/common'
import type {
  OracleProviderType,
  ISpotPriceInfo,
  SpotPricesInfo,
} from '@summerfi/sdk-common/oracle'
import { IOracleProvider } from './IOracleProvider'
import { IManagerWithProviders } from '@summerfi/sdk-server-common'
/**
 * @name IOracleManager
 * @description This is the highest level interface that will choose and call appropriate provider for a price consultation
 */
export interface IOracleManager extends IManagerWithProviders<OracleProviderType, IOracleProvider> {
  /**
   * @name getSpotPrice
   * @description Returns the prevailing market price for a given asset
   *              in terms of a base currency
   * @param baseToken Token for which the price is being requested
   * @param denomination Token in which the price is being requested, defaults to USD
   * @param forceUseProvider Optional provider to force the use of
   */
  getSpotPrice(params: {
    baseToken: IToken
    denomination?: Denomination
    forceUseProvider?: OracleProviderType
  }): Promise<ISpotPriceInfo>

  /**
   * @name getSpotPrices
   * @description Returns the prevailing market price for a given asset
   *              in terms of a base currency
   * @param baseToken A price request for baseToken
   * @param quoteTokens A price request for multiple quoteTokens
   * @param forceUseProvider Optional provider to force the use of
   */
  getSpotPrices(params: {
    chainInfo: IChainInfo
    baseTokens: IToken[]
    quoteCurrency?: FiatCurrency
    forceUseProvider?: OracleProviderType
  }): Promise<SpotPricesInfo>
}
