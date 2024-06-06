import type { IToken, Denomination } from '@summerfi/sdk-common/common'
import type { OracleProviderType, SpotPriceInfo } from '@summerfi/sdk-common/oracle'
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
   * @param quoteToken Token in which the price is being requested, defaults to USD
   */
  getSpotPrice(params: { baseToken: IToken; quoteToken?: Denomination }): Promise<SpotPriceInfo>
}
