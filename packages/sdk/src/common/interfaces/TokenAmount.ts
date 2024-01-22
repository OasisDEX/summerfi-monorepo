import { Printable } from './Printable'
import { Token } from './Token'

/**
 * @class TokenAmount
 * @description Represents an amount of a certain token. The amount is represented as a string to avoid
 *              issues with big number representation. The token gives enough information to parse it into
 *              a big number.
 */
export class TokenAmount implements Printable {
  public readonly token: Token
  public readonly amount: string

  constructor(token: Token, amount: string) {
    this.token = token
    this.amount = amount
  }

  public static create(token: Token, amount: string): TokenAmount {
    return new TokenAmount(token, amount)
  }

  public toString(): string {
    return `${this.amount} ${this.token.symbol}`
  }
}
