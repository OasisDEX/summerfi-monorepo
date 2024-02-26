import { type Token } from '~sdk-common/common/implementation'
import { BigNumber } from 'bignumber.js'
import { SerializationManager } from '~sdk-common/common/managers'

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

  static createFrom(params: { token: Token; amount: string }): TokenAmount {
    return new TokenAmount(params)
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

SerializationManager.registerClass(TokenAmount)
