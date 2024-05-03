import BigNumber from 'bignumber.js'
import { CurrencySymbol } from '../enums/CurrencySymbol'
import { IToken, ITokenData, TokenSchema } from './IToken'
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
  readonly baseToken: ITokenData
  /** The token for the quote of the price */
  readonly quoteToken: ITokenData | CurrencySymbol
}

/**
 * @name IPrice
 * @description Interface for the implementors of the price
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IPrice extends IPriceData {
  readonly value: string
  readonly baseToken: IToken
  readonly quoteToken: IToken | CurrencySymbol

  /**
   * @name toBN
   * @description Converts the price to a BigNumber
   */
  toBN(): BigNumber

  /**
   * @name hasSameQuoteToken
   * @description Checks if the price has the same quote token as another price
   * @param b The price to compare against
   */
  hasSameQuoteToken(b: IPrice): boolean

  /**
   * @name div
   * @description Divides the price by another price
   * @param b The price to divide by
   */
  div(b: IPrice): IPrice
}

/**
 * @description Zod schema for IPrice
 */
export const PriceSchema = z.object({
  value: z.string(),
  baseToken: TokenSchema,
  quoteToken: TokenSchema,
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
