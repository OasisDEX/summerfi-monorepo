import { IToken, TokenSchema, isToken } from './IToken'
import { z } from 'zod'

/**
 * @name ITokenAmount
 * @description Represents an amount of a token
 *
 * The amount is represented as a string in floating point format without taking into consideration
 * the number of decimals of the token. This data type can be used for calculations with other types
 * like Price or Percentage
 */
export interface ITokenAmount {
  token: IToken
  amount: string
}

/**
 * @description Type guard for ITokenAmount
 * @param maybeTokenAmount
 * @returns true if the object is an ITokenAmount
 */
export function isTokenAmount(maybeTokenAmount: unknown): maybeTokenAmount is ITokenAmount {
  return (
    typeof maybeTokenAmount === 'object' &&
    maybeTokenAmount !== null &&
    'token' in maybeTokenAmount &&
    isToken(maybeTokenAmount.token) &&
    'amount' in maybeTokenAmount
  )
}

/**
 * @description Zod schema for ITokenAmount
 */
export const TokenAmountSchema = z.object({
  token: TokenSchema,
  amount: z.string(),
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: ITokenAmount = {} as z.infer<typeof TokenAmountSchema>
