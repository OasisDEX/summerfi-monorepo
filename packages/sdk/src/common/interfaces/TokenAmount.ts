import { Printable } from './Printable'
import { Token } from './Token'

/**
 * @interface TokenAmount
 * @description Represents an amount of a certain token. The amount is represented as a string to avoid
 *              issues with big number representation. The token gives enough information to parse it into
 *              a big number.
 */
export interface TokenAmount extends Printable {
  token: Token
  amount: string
}
