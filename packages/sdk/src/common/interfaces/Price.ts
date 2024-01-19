import { Printable } from './Printable'
import { Token } from './Token'

/**
 * @enum Currency
 * @description To be used for printing purposes only
 */
export enum Currency {
  USD = 'USD',
}

/**
 * @interface Price
 * @description Represents a price of a token (baseToken) in a given currency (quoteToken)
 */
export interface Price extends Printable {
  /** The amount of tokens in floating point format (i.e.: 123.98) */
  value: string
  /** The token that the price is for */
  baseToken: Token
  /** The token that the price is in */
  quoteToken?: Token
}
