import { z } from 'zod'
import { Denomination, DenominationDataSchema } from '../types/Denomination'
import { type IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import { type IPercentage } from './IPercentage'
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
export type PriceMulParamType =
  | string
  | number
  | IPrice
  | ITokenAmount
  | IFiatCurrencyAmount
  | IPercentage
/** Infers the result type of multiplying a price by an operand of type `T`. */
export type PriceMulReturnType<T> = T extends ITokenAmount
  ? ITokenAmount | IFiatCurrencyAmount
  : T extends IFiatCurrencyAmount
    ? IFiatCurrencyAmount | ITokenAmount
    : IPrice

/**
 * Represents a price for a token with certain denomation. The denomination can be a fiat currency
 * or another token
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
  readonly [__signature__]: symbol
  /** The price value in floating point format without taking into account decimals */
  readonly value: string
  /** The token for the base of the price */
  readonly base: Denomination
  /** The token for the quote of the price */
  readonly quote: Denomination

  /**
   * Checks if the price has the same quote as another price
   *
   * @param otherPrice The price to compare against
   * @returns true if the prices have the same quote
   */
  hasSameQuote(otherPrice: IPrice): boolean

  /**
   * Checks if the price has the same base as another price
   *
   * @param otherPrice The price to compare against
   * @returns true if the prices have the same base token
   */
  hasSameBase(otherPrice: IPrice): boolean

  /**
   * Checks if the price has the same base and quote as another price
   *
   * @param otherPrice The price to compare against
   * @returns true if the prices have the same base and quote
   */
  hasSameDenominations(otherPrice: IPrice): boolean

  /**
   * Adds the price to another price
   *
   * @param otherPrice The price to add
   * @returns The resulting price
   *
   * @throws If the prices have different base tokens or quote tokens
   */
  add(otherPrice: IPrice): IPrice

  /**
   * Subtracts the price from another price
   *
   * @param otherPrice The price to subtract
   * @returns The resulting price
   *
   * @throws If the prices have different base tokens or quote tokens
   */
  subtract(otherPrice: IPrice): IPrice

  /**
   * Multiplies the price by another price or a constant
   *
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
   * Divides the price by another price or a constant
   *
   * @param divider The numeric string, number or price to divide by
   * @returns The resulting price
   *
   * @throws If the second price base is not the same as this price base
   *         or if the second price quote is not the same as this price quote
   */
  divide(divider: string | number | IPrice): IPrice

  /**
   * Inverts the price
   *
   * @returns The inverted price
   */
  invert(): IPrice

  /**
   * Converts the price to a string
   */
  toString(): string

  /**
   * Checks if the price is less than another price
   */
  isLessThan(otherPrice: IPrice): boolean

  /**
   * Checks if the price is less than or equal to another price
   */
  isLessThanOrEqual(otherPrice: IPrice): boolean

  /**
   * Checks if the price is greater than another price
   */
  isGreaterThan(otherPrice: IPrice): boolean

  /**
   * Checks if the price is greater than or equal to another price
   */
  isGreaterThanOrEqual(otherPrice: IPrice): boolean

  /**
   * Checks if the price is zero
   */
  isZero(): boolean

  /**
   * Checks if the price is equal to another price
   */
  isEqual(otherPrice: IPrice): boolean
}

/**
 * Zod schema for IPrice
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
 * Type guard for isPrice
 *
 * @param maybePrice
 * @returns true if the object is an isPrice
 */
export function isPrice(maybePrice: unknown): maybePrice is IPrice {
  return PriceDataSchema.safeParse(maybePrice).success
}
