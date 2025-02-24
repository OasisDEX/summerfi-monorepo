import { IPrice, PriceDataSchema } from '../common/interfaces/IPrice'
import { IToken, TokenDataSchema } from '../common/interfaces/IToken'
import { OracleProviderType, OracleProviderTypeSchema } from './OracleProviderType'
import { z } from 'zod'

/**
 * @name SpotPriceInfo
 * @description Gives the current market price for a specific asset
 */
export type SpotPriceInfo = {
  /** The oracle provider type */
  provider: OracleProviderType
  /** The token for which the price is being requested. Also included in price, but added here for convenience */
  token: IToken
  /** The price of the asset */
  price: IPrice
}

/**
 * @description Zod schema for SpotPriceInfo
 */
export const SpotPriceInfoDataSchema = z.object({
  provider: OracleProviderTypeSchema,
  token: TokenDataSchema,
  price: PriceDataSchema,
})

/**
 * @name SpotPricesInfo
 * @description Gives the current market price for a specific list of assets
 */
export type SpotPricesInfo = {
  /** The oracle provider type */
  provider: OracleProviderType
  /** Price by addresses */
  priceByAddress: Record<string, IPrice>
}

/**
 * @description Zod schema for SpotPriceInfo
 */
export const SpotPricesInfoDataSchema = z.object({
  provider: OracleProviderTypeSchema,
  priceByAddress: z.record(z.string(), PriceDataSchema),
})
