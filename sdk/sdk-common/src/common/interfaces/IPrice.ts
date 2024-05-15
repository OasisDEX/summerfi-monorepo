import { BigNumber } from 'bignumber.js'
import { Denomination, DenominationDataSchema } from '../aliases/Denomination'
import { IPrintable } from './IPrintable'
import { type ITokenAmount } from './ITokenAmount'
import { type IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import { z } from 'zod'

/**
 * Return Type narrowing for multiply and divide methods, so the return type can be properly inferred
 *
 * This helps callers to know what to expect from the result of the operation
 */
export type PriceMulParamType = string | number | IPrice | ITokenAmount | IFiatCurrencyAmount
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
export interface IPrice extends IPriceData, IPrintable {
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
   * @name toBN
   * @description Converts the price to a BigNumber
   */
  toBN(): BigNumber

  /**
   * @name toString
   * @description Converts the price to a string
   */
  toString(): string
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
 * Type definition for the Price data
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
