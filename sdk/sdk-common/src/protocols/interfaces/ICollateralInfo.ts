import { IPercentage, PercentageDataSchema } from '../../common/interfaces/IPercentage'
import { IPrice, PriceDataSchema } from '../../common/interfaces/IPrice'
import { IRiskRatio, RiskRatioDataSchema } from '../../common/interfaces/IRiskRatio'
import { IToken, TokenDataSchema } from '../../common/interfaces/IToken'
import { ITokenAmount, TokenAmountDataSchema } from '../../common/interfaces/ITokenAmount'
import { z } from 'zod'
/**
 * @interface ICollateralInfo
 * @description Contains extended information about a collateral token of a lending pool
 */
export interface ICollateralInfo extends ICollateralInfoData {
  /** The token that represents the collateral */
  readonly token: IToken
  /** The price of the token in the protocol's default denomination */
  readonly price: IPrice
  /** The price of the token in USD */
  readonly priceUSD: IPrice
  /** The ratio between the collateral and the debt at which the position could be liquidated */
  readonly liquidationThreshold: IRiskRatio
  /** The maximum amount of the token that can be supplied */
  readonly maxSupply: ITokenAmount
  /** The amount of the token that is currently locked in the pool */
  readonly tokensLocked: ITokenAmount
  /** The penalty that is charged for liquidating a position */
  readonly liquidationPenalty: IPercentage
}

/**
 * @description Zod schema for ICollateralInfo
 */
export const CollateralInfoDataSchema = z.object({
  token: TokenDataSchema,
  price: PriceDataSchema,
  priceUSD: PriceDataSchema,
  liquidationThreshold: RiskRatioDataSchema,
  maxSupply: TokenAmountDataSchema,
  tokensLocked: TokenAmountDataSchema,
  liquidationPenalty: PercentageDataSchema,
})

/**
 * Type for the data part of the ICollateralInfo interface
 */
export type ICollateralInfoData = Readonly<z.infer<typeof CollateralInfoDataSchema>>

/**
 * @description Type guard for ICollateralInfo
 * @param maybeCollateralInfo
 * @returns true if the object is an ICollateralInfo
 */
export function isCollateralInfo(
  maybeCollateralInfo: unknown,
): maybeCollateralInfo is ICollateralInfoData {
  return CollateralInfoDataSchema.safeParse(maybeCollateralInfo).success
}
