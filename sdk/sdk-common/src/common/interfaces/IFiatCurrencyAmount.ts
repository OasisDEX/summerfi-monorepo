import { z } from 'zod'
import { FiatCurrency, FiatCurrencySchema } from '../enums/FiatCurrency'
import { type IPercentage } from './IPercentage'
import { type IPrice } from './IPrice'
import { IPrintable } from './IPrintable'
import { type ITokenAmount } from './ITokenAmount'
import { IValueConverter } from './IValueConverter'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signature__: unique symbol = Symbol()

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
 * @name IFiatCurrencyAmount
 * @description Represents an amount of a fiat currency
 *
 * The amount is represented as a string in floating point format without taking into consideration
 * the number of decimals of the token. This data type can be used for calculations with other types
 * like Price or Percentage
 */
export interface IFiatCurrencyAmount extends IFiatCurrencyAmountData, IValueConverter, IPrintable {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /** Fiat currency for the amount */
  readonly fiat: FiatCurrency
  /** The amount in floating point format */
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
export const FiatCurrencyAmountDataSchema = z.object({
  fiat: FiatCurrencySchema,
  amount: z.string(),
})

/**
 * Type for the data part of the IFiatCurrencyAmount interface
 */
export type IFiatCurrencyAmountData = Readonly<z.infer<typeof FiatCurrencyAmountDataSchema>>

/**
 * @description Type guard for IFiatCurrencyAmount
 * @param maybeTokenAmount
 * @returns true if the object is an ITokenAmount
 */
export function isFiatCurrencyAmount(
  maybeTokenAmount: unknown,
): maybeTokenAmount is IFiatCurrencyAmount {
  return FiatCurrencyAmountDataSchema.safeParse(maybeTokenAmount).success
}
