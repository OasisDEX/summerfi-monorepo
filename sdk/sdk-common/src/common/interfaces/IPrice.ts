import { BigNumber } from 'bignumber.js'
import { Denomination, DenominationData, DenominationSchema } from '../aliases/Denomination'
import { IPrintable } from './IPrintable'
import { type ITokenAmount } from './ITokenAmount'
import { type IFiatCurrencyAmount } from './IFiatCurrencyAmount'
import { z } from 'zod'

/**
 * @name IPriceData
 * @description Represents a price for a pair of tokens
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
export interface IPriceData {
  /** The price value in floating point format without taking into account decimals */
  readonly value: string
  /** The token for the base of the price */
  readonly base: DenominationData
  /** The token for the quote of the price */
  readonly quote: DenominationData
}

/**
 * @name IPrice
 * @description Interface for the implementors of the price
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IPrice extends IPriceData, IPrintable {
  readonly value: string
  readonly base: Denomination
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
  multiply(
    multiplier: string | number | IPrice | ITokenAmount | IFiatCurrencyAmount,
  ): IPrice | ITokenAmount | IFiatCurrencyAmount

  /**
   * @name div
   * @description Divides the price by another price or a constant
   * @param divier The numeric string, number, price, token amount or fiat currency amount to divide by
   * @returns The resulting price
   *
   * @throws If the second price base is not the same as this price base
   *         or if the second price quote is not the same as this price quote
   */
  divide(
    divider: string | number | IPrice | ITokenAmount | IFiatCurrencyAmount,
  ): IPrice | ITokenAmount | IFiatCurrencyAmount

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
export const PriceSchema = z.object({
  value: z.string(),
  base: DenominationSchema,
  quote: DenominationSchema,
})

/**
 * @description Type guard for IPrice
 * @param maybePrice
 * @returns true if the object is an IPrice
 */
export function isPrice(maybePrice: unknown): maybePrice is IPriceData {
  return PriceSchema.safeParse(maybePrice).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPriceData = {} as z.infer<typeof PriceSchema>
