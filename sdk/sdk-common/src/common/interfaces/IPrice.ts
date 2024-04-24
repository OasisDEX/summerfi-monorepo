import { CurrencySymbol } from '../enums/CurrencySymbol'
import { IToken, TokenSchema, isToken } from './IToken'
import { z } from 'zod'

/**
 * @name IPrice
 * @description Represents a price for a pair of tokens
 *
 * The price is represented as a string in floating point format without taking into consideration
 * the number of decimals of the tokens. This data type can be used for calculations with other types
 * like TokenAmount or Percentage
 */
export interface IPrice {
  value: string
  baseToken: IToken
  quoteToken: IToken | CurrencySymbol
}

/**
 * @description Type guard for IPrice
 * @param maybePrice
 * @returns true if the object is an IPrice
 */
export function isPrice(maybePrice: unknown): maybePrice is IPrice {
  return (
    typeof maybePrice === 'object' &&
    maybePrice !== null &&
    'value' in maybePrice &&
    'baseToken' in maybePrice &&
    isToken(maybePrice.baseToken) &&
    'quoteToken' in maybePrice &&
    isToken(maybePrice.quoteToken)
  )
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
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPrice = {} as z.infer<typeof PriceSchema>
