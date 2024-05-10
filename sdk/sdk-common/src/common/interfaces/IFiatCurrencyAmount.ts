import { FiatCurrency, FiatCurrencySchema } from '../enums'
import { type IPercentage } from './IPercentage'
import { type ITokenAmount } from './ITokenAmount'
import { type IPrice } from './IPrice'
import { IPrintable } from './IPrintable'
import { z } from 'zod'

/**
 * Return Type narrowing for multiply and divide methods, so the return type can be properly inferred
 *
 * This helps callers to know what to expect from the result of the operation
 */
export type FiatCurrencyAmountMulDivParamType = string | number | IPrice | IPercentage
export type FiatCurrencyAmountMulDivReturnType<T> = T extends IPrice
  ? ITokenAmount | IFiatCurrencyAmount
  : T extends IPercentage | string | number
    ? ITokenAmount
    : never

/**
 * @name IFiatCurrencyAmountData
 * @description Represents an amount of a fiat currency
 *
 * The amount is represented as a string in floating point format without taking into consideration
 * the number of decimals of the token. This data type can be used for calculations with other types
 * like Price or Percentage
 */
export interface IFiatCurrencyAmountData {
  /** Fiat currency for the amount */
  readonly fiat: FiatCurrency
  /** The amount in floating point format */
  readonly amount: string
}

/**
 * @name IFiatCurrencyAmount
 * @description Interface for the implementors of the fiat currency amount
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IFiatCurrencyAmount extends IFiatCurrencyAmountData, IPrintable {
  readonly fiat: FiatCurrency
  readonly amount: string

  /**
   * @name add
   * @param fiatToAdd FiatCurrencyAmount to add
   * @returns The resulting FiatCurrencyAmount
   */
  add(fiatToAdd: IFiatCurrencyAmount): IFiatCurrencyAmount

  /**
   * @name subtract
   * @param tokenToSubstract FiatCurrencyAmount to subtract
   * @returns The resulting FiatCurrencyAmount
   */
  subtract(fiatToSubtract: IFiatCurrencyAmount): IFiatCurrencyAmount

  /**
   * @name multiply
   * @param multiplier A percentage, string amount or number to multiply
   * @returns The resulting FiatCurrencyAmount
   */
  multiply<
    InputParams extends FiatCurrencyAmountMulDivParamType,
    ReturnType = FiatCurrencyAmountMulDivReturnType<InputParams>,
  >(
    multiplier: InputParams,
  ): ReturnType

  /**
   * @name divide
   * @param divisor A percentage, price string amount or number to divide
   * @returns The resulting FiatCurrencyAmount
   */
  divide<
    InputParams extends FiatCurrencyAmountMulDivParamType,
    ReturnType = FiatCurrencyAmountMulDivReturnType<InputParams>,
  >(
    divisor: InputParams,
  ): ReturnType
}

/**
 * @description Zod schema for IFiatCurrencyAmount
 */
export const FiatCurrencyAmountSchema = z.object({
  fiat: FiatCurrencySchema,
  amount: z.string(),
})

/**
 * @description Type guard for IFiatCurrencyAmount
 * @param maybeTokenAmount
 * @returns true if the object is an ITokenAmount
 */
export function isFiatCurrencyAmount(
  maybeTokenAmount: unknown,
): maybeTokenAmount is IFiatCurrencyAmountData {
  return FiatCurrencyAmountSchema.safeParse(maybeTokenAmount).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IFiatCurrencyAmountData = {} as z.infer<typeof FiatCurrencyAmountSchema>
