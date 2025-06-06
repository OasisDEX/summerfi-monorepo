import { z } from 'zod'
import { IPercentage, isPercentage } from '../../common/interfaces/IPercentage'
import { IRiskRatio, isRiskRatio } from '../../common/interfaces/IRiskRatio'
import { IToken, isToken } from '../../common/interfaces/IToken'
import { IPrice, isPrice, ITokenAmount, isTokenAmount } from '../../common/interfaces/ITokenAmount'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

/**
 * @interface ICollateralInfo
 * @description Contains extended information about a collateral token of a lending pool
 */
export interface ICollateralInfo extends ICollateralInfoData {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
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
  token: z.custom<IToken>((val) => isToken(val)),
  price: z.custom<IPrice>((val) => isPrice(val)),
  priceUSD: z.custom<IPrice>((val) => isPrice(val)),
  liquidationThreshold: z.custom<IRiskRatio>((val) => isRiskRatio(val)),
  maxSupply: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  tokensLocked: z.custom<ITokenAmount>((val) => isTokenAmount(val)),
  liquidationPenalty: z.custom<IPercentage>((val) => isPercentage(val)),
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
