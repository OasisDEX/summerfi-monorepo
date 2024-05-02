import { IPercentage, IPercentageData, PercentageSchema } from '../../common/interfaces/IPercentage'
import { IPrice, IPriceData, PriceSchema } from '../../common/interfaces/IPrice'
import { IRiskRatio, IRiskRatioData, RiskRatioSchema } from '../../common/interfaces/IRiskRatio'
import { IToken, ITokenData, TokenSchema } from '../../common/interfaces/IToken'
import {
  ITokenAmount,
  ITokenAmountData,
  TokenAmountSchema,
} from '../../common/interfaces/ITokenAmount'
import { z } from 'zod'

/**
 * @interface ICollateralInfoData
 * @description Contains extended information about a collateral token of a lending pool
 */
export interface ICollateralInfoData {
  /** The token that represents the collateral */
  readonly token: ITokenData
  /** The price of the token in the protocol's default denomination */
  readonly price: IPriceData
  /** The price of the token in USD */
  readonly priceUSD: IPriceData
  /** The ratio between the collateral and the debt at which the position could be liquidated */
  readonly liquidationThreshold: IRiskRatioData
  /** The maximum amount of the token that can be supplied */
  readonly maxSupply: ITokenAmountData
  /** The amount of the token that is currently locked in the pool */
  readonly tokensLocked: ITokenAmountData
  /** The penalty that is charged for liquidating a position */
  readonly liquidationPenalty: IPercentageData
}

/**
 * @interface ICollateralInfo
 * @description Interface for the implementors of the collateral info
 */
export interface ICollateralInfo extends ICollateralInfoData {
  readonly token: IToken
  readonly price: IPrice
  readonly priceUSD: IPrice
  readonly liquidationThreshold: IRiskRatio
  readonly maxSupply: ITokenAmount
  readonly tokensLocked: ITokenAmount
  readonly liquidationPenalty: IPercentage
}

/**
 * @description Zod schema for ICollateralInfo
 */
export const CollateralInfoSchema = z.object({
  token: TokenSchema,
  price: PriceSchema,
  priceUSD: PriceSchema,
  liquidationThreshold: RiskRatioSchema,
  maxSupply: TokenAmountSchema,
  tokensLocked: TokenAmountSchema,
  liquidationPenalty: PercentageSchema,
})

/**
 * @description Type guard for ICollateralInfo
 * @param maybeCollateralInfo
 * @returns true if the object is an ICollateralInfo
 */
export function isCollateralInfo(
  maybeCollateralInfo: unknown,
): maybeCollateralInfo is ICollateralInfoData {
  return CollateralInfoSchema.safeParse(maybeCollateralInfo).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ICollateralInfoData = {} as z.infer<typeof CollateralInfoSchema>
