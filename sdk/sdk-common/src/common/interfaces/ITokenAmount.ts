import { z } from 'zod'
import { type IPercentage } from './IPercentage'
import { IPrintable } from './IPrintable'
import { isToken, type IToken } from './IToken'
import { IValueConverter } from './IValueConverter'
import { FiatCurrencySchema, type FiatCurrency } from '../enums/FiatCurrency'
import { DenominationDataSchema, type Denomination } from '../types/Denomination'

/**
 * Unique signature to provide branded types to the interface
 */
export const __signatureTokenAmount__: unique symbol = Symbol()

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
  readonly [__signatureTokenAmount__]: symbol
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

/**
 * Unique signature to provide branded types to the interface
 */
export const __signatureFiatCurrencyAmount__: unique symbol = Symbol()

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
  readonly [__signatureFiatCurrencyAmount__]: symbol
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

/**
 * Unique signature to provide branded types to the interface
 */
export const __signaturePrice__: unique symbol = Symbol()

/**
 * Return Type narrowing for multiply and divide methods, so the return type can be properly inferred
 *
 * This helps callers to know what to expect from the result of the operation
 */
export type PriceMulParamType =
  | string
  | number
  | IPrice
  | ITokenAmount
  | IFiatCurrencyAmount
  | IPercentage
export type PriceMulReturnType<T> = T extends ITokenAmount
  ? ITokenAmount | IFiatCurrencyAmount
  : T extends IFiatCurrencyAmount
    ? IFiatCurrencyAmount | ITokenAmount
    : IPrice

/**
 * @name IPrice
 * @description Represents a price for a token with certain denomation. The denomination can be a fiat currency
 *              or another token
 *
 * The price is represented as a string in floating point format without taking into consideration
 * the number of decimals of the tokens. This data type can be used for calculations with other types
 * like TokenAmount or Percentage
 *
 * Typically in exchanges the price is represented in the following format:
 *
 * BASE/QUOTE
 *
 * Base is the token that is being traded, and quote is the token that is received as part of the trade
 *
 * In that format the slash in between the base and the quote is not a quotient or fraction,
 * and it is just used to separate the two tokens.
 *
 * The mathematical representation of the price units is instead:
 *
 * QUOTE/BASE
 */
export interface IPrice extends IPriceData, IValueConverter, IPrintable {
  /** Signature to differentiate from similar interfaces */
  readonly [__signaturePrice__]: symbol
  /** The price value in floating point format without taking into account decimals */
  readonly value: string
  /** The token for the base of the price */
  readonly base: Denomination
  /** The token for the quote of the price */
  readonly quote: Denomination

  /**
   * @name hasSameQuote
   * @description Checks if the price has the same quote as another price
   * @param otherPrice The price to compare against
   * @returns true if the prices have the same quote
   */
  hasSameQuote(otherPrice: IPrice): boolean

  /**
   * @name hasSameBase
   * @description Checks if the price has the same base as another price
   * @param otherPrice The price to compare against
   * @returns true if the prices have the same base token
   */
  hasSameBase(otherPrice: IPrice): boolean

  /**
   * @name hasSameDenominations
   * @description Checks if the price has the same base and quote as another price
   * @param otherPrice The price to compare against
   * @returns true if the prices have the same base and quote
   */
  hasSameDenominations(otherPrice: IPrice): boolean

  /**
   * @name add
   * @description Adds the price to another price
   * @param otherPrice The price to add
   * @returns The resulting price
   *
   * @throws If the prices have different base tokens or quote tokens
   */
  add(otherPrice: IPrice): IPrice

  /**
   * @name subtract
   * @description Subtracts the price from another price
   * @param otherPrice The price to subtract
   * @returns The resulting price
   *
   * @throws If the prices have different base tokens or quote tokens
   */
  subtract(otherPrice: IPrice): IPrice

  /**
   * @name multiply
   * @description Multiplies the price by another price or a constant
   * @param multiplier The numeric string, number, price, token amount or fiat currency amount to multiply by
   * @returns The resulting price, token amount or fiat currency amount
   *
   * @throws When it is a price, if the second price quote is not the same as this price base or
   *         if the second price base is not the same as this price quote it will throw an error
   */
  multiply<InputParams extends PriceMulParamType, ReturnType = PriceMulReturnType<InputParams>>(
    multiplier: InputParams,
  ): ReturnType

  /**
   * @name divide
   * @description Divides the price by another price or a constant
   * @param divider The numeric string, number or price to divide by
   * @returns The resulting price
   *
   * @throws If the second price base is not the same as this price base
   *         or if the second price quote is not the same as this price quote
   */
  divide(divider: string | number | IPrice): IPrice

  /**
   * @name invert
   * @description Inverts the price
   * @returns The inverted price
   */
  invert(): IPrice

  /**
   * @name toString
   * @description Converts the price to a string
   */
  toString(): string

  /**
   * @name isLessThan
   * @description Checks if the price is less than another price
   */
  isLessThan(otherPrice: IPrice): boolean

  /**
   * @name isLessThanOrEqual
   * @description Checks if the price is less than or equal to another price
   */
  isLessThanOrEqual(otherPrice: IPrice): boolean

  /**
   * @name isGreaterThan
   * @description Checks if the price is greater than another price
   */
  isGreaterThan(otherPrice: IPrice): boolean

  /**
   * @name isGreaterThanOrEqual
   * @description Checks if the price is greater than or equal to another price
   */
  isGreaterThanOrEqual(otherPrice: IPrice): boolean

  /**
   * @name isZero
   * @description Checks if the price is zero
   */
  isZero(): boolean

  /**
   * @name isEqual
   * @description Checks if the price is equal to another price
   */
  isEqual(otherPrice: IPrice): boolean
}

/**
 * @description Zod schema for IPrice
 */
export const PriceDataSchema = z.object({
  value: z.string(),
  base: DenominationDataSchema,
  quote: DenominationDataSchema,
})

/**
 * Type definition for the IPrice data
 */
export type IPriceData = Readonly<z.infer<typeof PriceDataSchema>>

/**
 * @description Type guard for isPrice
 * @param maybePrice
 * @returns true if the object is an isPrice
 */
export function isPrice(maybePrice: unknown): maybePrice is IPrice {
  return PriceDataSchema.safeParse(maybePrice).success
}
