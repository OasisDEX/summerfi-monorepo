import { Printable } from './Printable'
import { Token } from './Token'
import { BigNumber } from 'bignumber.js'

/**
 * @class TokenAmount
 * @description Represents an amount of a certain token. The amount is represented as a string to avoid
 *              issues with big number representation. The token gives enough information to parse it into
 *              a big number.
 */
export class TokenAmount implements Printable {
  public readonly token: Token
  public readonly amount: string
  private readonly _baseUnitFactor: BigNumber

  constructor(token: Token, amount: string) {
    this.token = token
    this.amount = amount
    this._baseUnitFactor = new BigNumber(10).pow(new BigNumber(token.decimals))
  }

  public static createFrom(params: { token: Token; amount: string }): TokenAmount {
    return new TokenAmount(params.token, params.amount)
  }

  public toString(): string {
    return `${this.amount} ${this.token.symbol}`
  }

  public toBaseUnit(): string {
    return new BigNumber(this.amount).times(this._baseUnitFactor).toFixed(0)
  }

  public toBN(): BigNumber {
    return new BigNumber(this.amount)
  }
}
