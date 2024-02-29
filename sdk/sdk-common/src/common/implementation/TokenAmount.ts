import { type Token } from '~sdk-common/common/implementation'
import { BigNumber } from 'bignumber.js'
import { SerializationService } from '~sdk-common/common/services'

interface ITokenAmountSerialized {
  token: Token
  amount: string
}

/**
 * @class TokenAmount
 * @description Represents an amount of a certain token. The amount is represented as a string to avoid
 *              issues with big number representation. The token gives enough information to parse it into
 *              a big number.
 */
export class TokenAmount implements ITokenAmountSerialized {
  private readonly _baseUnitFactor: BigNumber

  readonly token: Token
  readonly amount: string

  private constructor(params: ITokenAmountSerialized) {
    this.token = params.token
    this.amount = params.amount
    this._baseUnitFactor = new BigNumber(10).pow(new BigNumber(params.token.decimals))
  }

  private get amountBN(): BigNumber {
    return this.toBN()
  }

  static createFrom(params: { token: Token; amount: string }): TokenAmount {
    return new TokenAmount(params)
  }
  // amount in base unit (1eth = 1000000000000000000, 1btc = 100000000 etc)
  public static createFromBaseUnit(parmas: { token: Token; amount: string }): TokenAmount {
    const amount = new BigNumber(parmas.amount)
      .div(new BigNumber(10).pow(new BigNumber(parmas.token.decimals)))
      .toString()
    return new TokenAmount({ token: parmas.token, amount: amount })
  }

  public add(tokenToAdd: TokenAmount): TokenAmount {
    if (tokenToAdd.token.symbol !== this.token.symbol) {
      throw new Error('Token symbols do not match')
    }

    return new TokenAmount({
      token: this.token,
      amount: this.amountBN.plus(tokenToAdd.amountBN).toString(),
    })
  }

  public subtract(tokenToSubstract: TokenAmount): TokenAmount {
    if (tokenToSubstract.token.symbol !== this.token.symbol) {
      throw new Error('Token symbols do not match')
    }

    return new TokenAmount({
      token: this.token,
      amount: this.amountBN.minus(tokenToSubstract.amountBN).toString(),
    })
  }

  public multiply(multiplier: string | number): TokenAmount {
    return new TokenAmount({
      token: this.token,
      amount: this.amountBN.times(multiplier).toString(),
    })
  }

  public divide(divisor: string | number): TokenAmount {
    return new TokenAmount({ token: this.token, amount: this.amountBN.div(divisor).toString() })
  }

  toString(): string {
    return `${this.amount} ${this.token.symbol}`
  }

  toBaseUnit(): string {
    return new BigNumber(this.amount).times(this._baseUnitFactor).toFixed(0)
  }

  toBN(): BigNumber {
    return new BigNumber(this.amount)
  }
}

SerializationService.registerClass(TokenAmount)
