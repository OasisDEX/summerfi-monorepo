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
  public readonly amount: string // propably we need to go with BigNumber

  constructor(token: Token, amount: string) {
    this.token = token
    this.amount = amount
  }

// amount human readable (1eth = 1, 1btc = 1 etc)
  public static createFrom(params: { token: Token; amount: string }): TokenAmount {
    return new TokenAmount(params.token, params.amount)
  }

  public static createFromBaseUnit(parmas: {token: Token, amount: string}): TokenAmount {
    return new TokenAmount(parmas.token, (parseFloat(parmas.amount) / Math.pow(10, parmas.token.decimals)).toString())
  }

  public add(amount: TokenAmount): TokenAmount {
    if (amount.token.symbol !== this.token.symbol) {
      throw new Error('Token symbols do not match')
    }

    // TODO: we need to go with BigNumber
    return new TokenAmount(this.token, (parseFloat(this.amount) + parseFloat(amount.amount)).toString())
  }

  public substrac(amount: TokenAmount): TokenAmount {
    if (amount.token.symbol !== this.token.symbol) {
      throw new Error('Token symbols do not match')
    }

    // TODO: we need to go with BigNumber
    return new TokenAmount(this.token, (parseFloat(this.amount) - parseFloat(amount.amount)).toString())
  }

  public toString(): string {
    return `${this.amount} ${this.token.symbol}`
  }
}
