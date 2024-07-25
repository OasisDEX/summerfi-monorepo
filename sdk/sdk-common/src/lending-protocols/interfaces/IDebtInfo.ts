import { IPercentage, PercentageDataSchema } from '../../common/interfaces/IPercentage'
import { IPrice, PriceDataSchema } from '../../common/interfaces/IPrice'
import { IToken, TokenDataSchema } from '../../common/interfaces/IToken'
import { ITokenAmount, TokenAmountDataSchema } from '../../common/interfaces/ITokenAmount'
import { z } from 'zod'

/**
 * @interface IDebtInfo
 * @description Contains information about a debt token of a lending pool
 *
 * Initially this is used for single pair lending pools, but it can be re-used in multi-token
 * lending pools
 */
export interface IDebtInfo extends IDebtInfoData {
  /** The token that represents the debt */
  readonly token: IToken
  /** The price of the token in the protocol's default denomination */
  readonly price: IPrice
  /** The price of the token in USD */
  readonly priceUSD: IPrice
  /** The interest rate of the debt. TODO: which units?? */
  readonly interestRate: IPercentage
  /** The total amount of the token borrowed */
  readonly totalBorrowed: ITokenAmount
  /** The maximum amount of the token that can be borrowed */
  readonly debtCeiling: ITokenAmount
  /** The amount of the token that can still be borrowed */
  readonly debtAvailable: ITokenAmount
  /** The minimum amount of the token that can be borrowed */
  readonly dustLimit: ITokenAmount
  /** The fee that is charged for creating a new debt */
  readonly originationFee: IPercentage
}

/**
 * @description Zod schema for IDebtInfo
 */
export const DebtInfoDataSchema = z.object({
  token: TokenDataSchema,
  price: PriceDataSchema,
  priceUSD: PriceDataSchema,
  interestRate: PercentageDataSchema,
  totalBorrowed: TokenAmountDataSchema,
  debtCeiling: TokenAmountDataSchema,
  debtAvailable: TokenAmountDataSchema,
  dustLimit: TokenAmountDataSchema,
  originationFee: PercentageDataSchema,
})

/**
 * Type for the data part of the IDebtInfo interface
 */
export type IDebtInfoData = Readonly<z.infer<typeof DebtInfoDataSchema>>

/**
 * @description Type guard for IDebtInfo
 * @param maybeDebtInfo
 * @returns true if the object is an IDebtInfo
 */
export function isDebtInfo(maybeDebtInfo: unknown): maybeDebtInfo is IDebtInfoData {
  return DebtInfoDataSchema.safeParse(maybeDebtInfo).success
}
