import { IPercentage, IPercentageData, PercentageSchema } from '../../common/interfaces/IPercentage'
import { IPrice, IPriceData, PriceSchema } from '../../common/interfaces/IPrice'
import { IToken, ITokenData, TokenSchema } from '../../common/interfaces/IToken'
import {
  ITokenAmount,
  ITokenAmountData,
  TokenAmountSchema,
} from '../../common/interfaces/ITokenAmount'
import { z } from 'zod'

/**
 * @interface IDebtInfoData
 * @description Contains information about a debt token of a lending pool
 *
 * Initially this is used for single pair lending pools, but it can be re-used in multi-token
 * lending pools
 */
export interface IDebtInfoData {
  /** The token that represents the debt */
  readonly token: ITokenData
  /** The price of the token in the protocol's default denomination */
  readonly price: IPriceData
  /** The price of the token in USD */
  readonly priceUSD: IPriceData
  /** The interest rate of the debt. TODO: which units?? */
  readonly interestRate: IPercentageData
  /** The total amount of the token borrowed */
  readonly totalBorrowed: ITokenAmountData
  /** The maximum amount of the token that can be borrowed */
  readonly debtCeiling: ITokenAmountData
  /** The amount of the token that can still be borrowed */
  readonly debtAvailable: ITokenAmountData
  /** The minimum amount of the token that can be borrowed */
  readonly dustLimit: ITokenAmountData
  /** The fee that is charged for creating a new debt */
  readonly originationFee: IPercentageData
}

/**
 * @interface IDebtInfo
 * @description Interface for the implementors of the debt info
 */
export interface IDebtInfo extends IDebtInfoData {
  readonly token: IToken
  readonly price: IPrice
  readonly priceUSD: IPrice
  readonly interestRate: IPercentage
  readonly totalBorrowed: ITokenAmount
  readonly debtCeiling: ITokenAmount
  readonly debtAvailable: ITokenAmount
  readonly dustLimit: ITokenAmount
  readonly originationFee: IPercentage
}

/**
 * @description Zod schema for IDebtInfo
 */
export const DebtInfoSchema = z.object({
  token: TokenSchema,
  price: PriceSchema,
  priceUSD: PriceSchema,
  interestRate: PercentageSchema,
  totalBorrowed: TokenAmountSchema,
  debtCeiling: TokenAmountSchema,
  debtAvailable: TokenAmountSchema,
  dustLimit: TokenAmountSchema,
  originationFee: PercentageSchema,
})

/**
 * @description Type guard for IDebtInfo
 * @param maybeDebtInfo
 * @returns true if the object is an IDebtInfo
 */
export function isDebtInfo(maybeDebtInfo: unknown): maybeDebtInfo is IDebtInfoData {
  return DebtInfoSchema.safeParse(maybeDebtInfo).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IDebtInfoData = {} as z.infer<typeof DebtInfoSchema>
