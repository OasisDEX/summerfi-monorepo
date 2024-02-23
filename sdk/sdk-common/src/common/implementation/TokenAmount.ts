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
  public readonly amount: BigNumber
  private readonly _baseUnitFactor: BigNumber

  constructor(token: Token, amount: string) {
    this.token = token
    this.amount = new BigNumber(amount)
    this._baseUnitFactor = new BigNumber(10).pow(new BigNumber(token.decimals))
  }

// amount human readable (1eth = 1, 1btc = 1 etc)
  public static createFrom(params: { token: Token; amount: string }): TokenAmount {
    return new TokenAmount(params.token, params.amount)
  }
// amount in base unit (1eth = 1000000000000000000, 1btc = 100000000 etc)
  public static createFromBaseUnit(parmas: {token: Token, amount: string}): TokenAmount {
    const amount = new BigNumber(parmas.amount).div(new BigNumber(10).pow(new BigNumber(parmas.token.decimals))).toString()
    return new TokenAmount(parmas.token, amount)
  }

  public add(tokenToAdd: TokenAmount): TokenAmount {
    if (tokenToAdd.token.symbol !== this.token.symbol) {
      throw new Error('Token symbols do not match')
    }

    return new TokenAmount(this.token, this.amount.plus(tokenToAdd.amount).toString())
  }

  public substrac(tokenToSubstract: TokenAmount): TokenAmount {
    if (tokenToSubstract.token.symbol !== this.token.symbol) {
      throw new Error('Token symbols do not match')
    }

    return new TokenAmount(this.token, this.amount.minus(tokenToSubstract.amount).toString())
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
