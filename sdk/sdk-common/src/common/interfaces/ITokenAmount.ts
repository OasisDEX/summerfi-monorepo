import { BigNumber } from 'bignumber.js'
import { type IPercentage } from './IPercentage'
import { IPrintable } from './IPrintable'
import { type IToken, TokenDataSchema } from './IToken'
import { type IPrice } from './IPrice'
import { type IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import { z } from 'zod'

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
}

/**
 * @description Zod schema for ITokenAmount
 */
export const TokenAmountDataSchema = z.object({
  token: TokenDataSchema,
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
export function isTokenAmount(maybeTokenAmount: unknown): maybeTokenAmount is ITokenAmount {
  return TokenAmountDataSchema.safeParse(maybeTokenAmount).success
}

/**
 * @description Type guard for ITokenAmountData
 * @param maybeTokenAmount
 * @returns true if the object is an ITokenAmountData
 */
export function isTokenAmountData(maybeTokenAmount: unknown): maybeTokenAmount is ITokenAmountData {
  return TokenAmountDataSchema.safeParse(maybeTokenAmount).success
}
