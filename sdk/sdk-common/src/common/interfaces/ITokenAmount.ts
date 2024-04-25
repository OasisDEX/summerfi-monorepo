import { IPercentageData } from './IPercentage'
import { IPrintable } from './IPrintable'
import { IToken, ITokenData, TokenSchema } from './IToken'
import { z } from 'zod'

/**
 * @name ITokenAmountData
 * @description Represents an amount of a token
 *
 * The amount is represented as a string in floating point format without taking into consideration
 * the number of decimals of the token. This data type can be used for calculations with other types
 * like Price or Percentage
 */
export interface ITokenAmountData {
  /** Token for the amount */
  readonly token: ITokenData
  /** The amount in floating point format without taking into account the token decimals*/
  readonly amount: string
}

/**
 * @name ITokenAmount
 * @description Interface for the implementors of the token amount
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface ITokenAmount extends ITokenAmountData, IPrintable {
  readonly token: IToken
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
   * @param multiplier A percentage, string amount or number to multiply
   * @returns The resulting TokenAmount
   */
  multiply(multiplier: IPercentageData | string | number): ITokenAmount

  /**
   * @name divide
   * @param divisor A percentage, string amount or number to divide
   * @returns The resulting TokenAmount
   */
  divide(divisor: IPercentageData | string | number): ITokenAmount
}

/**
 * @description Zod schema for ITokenAmount
 */
export const TokenAmountSchema = z.object({
  token: TokenSchema,
  amount: z.string(),
})

/**
 * @description Type guard for ITokenAmount
 * @param maybeTokenAmount
 * @returns true if the object is an ITokenAmount
 */
export function isTokenAmount(maybeTokenAmount: unknown): maybeTokenAmount is ITokenAmountData {
  return TokenAmountSchema.safeParse(maybeTokenAmount).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ITokenAmountData = {} as z.infer<typeof TokenAmountSchema>
