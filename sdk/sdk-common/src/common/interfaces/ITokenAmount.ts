import { BigNumber } from 'bignumber.js'
import { z } from 'zod'
import { type IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import { type IPercentage } from './IPercentage'
import { type IPrice } from './IPrice'
import { IPrintable } from './IPrintable'
import { isToken, type IToken } from './IToken'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
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
export interface ITokenAmount extends ITokenAmountData, IPrintable {
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
   * @name toBN
   * @description Converts the amount to a BigNumber in floating point representation
   * @returns The amount as a BigNumber
   */
  toBN(): BigNumber

  /**
   * @name toBaseUnit
   * @description Converts the amount to a string in base unit
   * @returns The amount as a string in base unit
   *
   * Base unit is the full integer amount in what is coloqually referred to as 'wei' units
   * This is, it includes all the decimals of the token and can be passed to a solidity contract
   */
  toBaseUnit(): string

  /**
   * @name isZero
   * @description Checks if the amount is zero
   * @returns true if the amount is zero or false otherwise
   */
  isZero(): boolean
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
