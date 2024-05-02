import { BigNumber } from 'bignumber.js'
import { Percentage } from './Percentage'
import { Token } from './Token'
import { SerializationService } from '../../services/SerializationService'
import { ITokenAmount, ITokenAmountData } from '../interfaces/ITokenAmount'

/**
 * @class TokenAmount
 * @see ITokenAmount
 */
export class TokenAmount implements ITokenAmount {
  readonly token: Token
  readonly amount: string

  // This is protected because otherwise TypeScript is removing the type when transpiling and it causes errors.
  // Apparently using protected prevents this bug
  protected readonly _baseUnitFactor: BigNumber

  private constructor(params: ITokenAmountData) {
    this.token = Token.createFrom(params.token)
    this.amount = params.amount
    this._baseUnitFactor = new BigNumber(10).pow(new BigNumber(params.token.decimals))
  }

  private get amountBN(): BigNumber {
    return this.toBN()
  }

  static createFrom(params: ITokenAmountData): TokenAmount {
    return new TokenAmount(params)
  }

  // amount in base unit (1eth = 1000000000000000000, 1btc = 100000000 etc)
  static createFromBaseUnit(params: { token: Token; amount: string }): TokenAmount {
    const amount = new BigNumber(params.amount)
      .div(new BigNumber(10).pow(new BigNumber(params.token.decimals)))
      .toString()
    return new TokenAmount({ token: params.token, amount: amount })
  }

  add(tokenToAdd: TokenAmount): TokenAmount {
    if (tokenToAdd.token.symbol !== this.token.symbol) {
      throw new Error(
        `Token symbols do not match: ${tokenToAdd.token.symbol} !== ${this.token.symbol}`,
      )
    }

    return new TokenAmount({
      token: this.token,
      amount: this.amountBN.plus(tokenToAdd.amountBN).toString(),
    })
  }

  subtract(tokenToSubstract: TokenAmount): TokenAmount {
    if (tokenToSubstract.token.symbol !== this.token.symbol) {
      throw new Error('Token symbols do not match')
    }

    return new TokenAmount({
      token: this.token,
      amount: this.amountBN.minus(tokenToSubstract.amountBN).toString(),
    })
  }

  multiply(multiplier: Percentage | string | number): TokenAmount {
    if (multiplier instanceof Percentage) {
      return new TokenAmount({
        token: this.token,
        amount: this.amountBN.times(multiplier.toProportion()).toString(),
      })
    }

    return new TokenAmount({
      token: this.token,
      amount: this.amountBN.times(multiplier).toString(),
    })
  }

  divide(divisor: Percentage | string | number): TokenAmount {
    if (divisor instanceof Percentage) {
      return new TokenAmount({
        token: this.token,
        amount: this.amountBN.div(divisor.value).toString(),
      })
    }

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
