import { z } from 'zod'
import { type IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import { type IPercentage } from './IPercentage'
import { type IPrice } from './IPrice'
import { IPrintable } from './IPrintable'
import { isToken, type IToken } from './IToken'
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
export type TokenAmountMulDivParamType = string | number | IPrice | IPercentage
export type TokenAmountMulDivReturnType<T> = T extends IPrice
  ? ITokenAmount | IFiatCurrencyAmount
  : T extends IPercentage | string | number
    ? ITokenAmount
    : never

/**
 * @name ITokenAmount
 * @description Interface for the implementors of the token amount
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface ITokenAmount extends ITokenAmountData, IValueConverter, IPrintable {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /** Token this amount refers to */
  readonly token: IToken
  /** Amount in floating point format without taking into account the token decimals */
  readonly amount: string

  /**
   * @name add
   * @param tokenToAdd TokenAmount to add
   * @returns The resulting TokenAmount
   */
  add(tokenToAdd: ITokenAmount): ITokenAmount

  /**
   * @name subtract
   * @param tokenToSubstract TokenAmount to subtract
   * @returns The resulting TokenAmount
   */
  subtract(tokenToSubstract: ITokenAmount): ITokenAmount

  /**
   * @name multiply
   * @param multiplier A percentage, price, string amount or number to multiply
   * @returns The resulting TokenAmount
   */
  multiply<
    InputParams extends TokenAmountMulDivParamType,
    ReturnType = TokenAmountMulDivReturnType<InputParams>,
  >(
    multiplier: InputParams,
  ): ReturnType

  /**
   * @name divide
   * @param divisor A percentage, price, string amount or number to divide
   * @returns The resulting TokenAmount
   */
  divide<
    InputParams extends TokenAmountMulDivParamType,
    ReturnType = TokenAmountMulDivReturnType<InputParams>,
  >(
    divisor: InputParams,
  ): ReturnType

  /**
   * @name isZero
   * @description Checks if the amount is zero
   * @returns true if the amount is zero or false otherwise
   */
  isZero(): boolean

  /**
   * @name isGreaterThan
   * @description Checks if the amount is greater than the provided TokenAmount
   * @param tokenAmount TokenAmount to compare
   * @returns true if the amount is greater than the provided TokenAmount
   */
  isGreaterThan(tokenAmount: ITokenAmount): boolean

  /**
   * @name isLessThan
   * @description Checks if the amount is less than the provided TokenAmount
   * @param tokenAmount TokenAmount to compare
   * @returns true if the amount is less than the provided TokenAmount
   */
  isLessThan(tokenAmount: ITokenAmount): boolean

  /**
   * @name isGreaterOrEqualThan
   * @description Checks if the amount is greater or equal than the provided TokenAmount
   * @param tokenAmount TokenAmount to compare
   * @returns true if the amount is greater or equal than the provided TokenAmount
   */
  isGreaterOrEqualThan(tokenAmount: ITokenAmount): boolean

  /**
   * @name isLessOrEqualThan
   * @description Checks if the amount is less or equal than the provided TokenAmount
   * @param tokenAmount TokenAmount to compare
   * @returns true if the amount is less or equal than the provided TokenAmount
   */
  isLessOrEqualThan(tokenAmount: ITokenAmount): boolean

  /**
   * @name isEqualTo
   * @description Checks if the amount is equal to the provided TokenAmount
   * @param tokenAmount TokenAmount to compare
   * @returns true if the amount is equal to the provided TokenAmount
   */
  isEqualTo(tokenAmount: ITokenAmount): boolean
}

/**
 * @description Zod schema for ITokenAmount
 */
export const TokenAmountDataSchema = z.object({
  token: z.custom<IToken>((val) => isToken(val)),
  amount: z.string(),
})

/**
 * Type definition for the TokenAmount data
 */
export type ITokenAmountData = Readonly<z.infer<typeof TokenAmountDataSchema>>

/**
 * @description Type guard for ITokenAmount
 * @param maybeTokenAmount
 * @returns true if the object is an ITokenAmount
 */
export function isTokenAmount(
  maybeTokenAmount: unknown,
  returnedErrors?: string[],
): maybeTokenAmount is ITokenAmount {
  const zodReturn = TokenAmountDataSchema.safeParse(maybeTokenAmount)

  if (!zodReturn.success && returnedErrors) {
    returnedErrors.push(...zodReturn.error.errors.map((e) => e.message))
  }

  return zodReturn.success
}

/**
 * @description Type guard for ITokenAmountData
 * @param maybeTokenAmount
 * @returns true if the object is an ITokenAmountData
 */
export function isTokenAmountData(maybeTokenAmount: unknown): maybeTokenAmount is ITokenAmountData {
  return TokenAmountDataSchema.safeParse(maybeTokenAmount).success
}
