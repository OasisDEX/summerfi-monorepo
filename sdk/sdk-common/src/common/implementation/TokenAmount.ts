import { BigNumber } from 'bignumber.js'
import { Token } from './Token'
import { SerializationService } from '../../services/SerializationService'
import { ITokenAmount, ITokenAmountData } from '../interfaces/ITokenAmount'
import { type IPercentage, isPercentage } from '../interfaces/IPercentage'
import { isPrice, type IPrice } from '../interfaces/IPrice'
import {
  divideTokenAmountByPercentage,
  multiplyTokenAmountByPercentage,
} from '../utils/PercentageUtils'
import { divideTokenAmountByPrice, multiplyTokenAmountByPrice } from '../utils/PriceUtils'
import { isFiatCurrencyAmount } from '../interfaces/IFiatCurrencyAmount'

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

  /** CONSTRUCTOR  */

  /** Sealed constructor */
  private constructor(params: ITokenAmountData) {
    this.token = Token.createFrom(params.token)
    this.amount = params.amount
    this._baseUnitFactor = new BigNumber(10).pow(new BigNumber(params.token.decimals))
  }

  /** FACTORY */

  /**
   * @name createFrom
   * @param params Token amount data to create the instance
   * @returns The resulting TokenAmount
   *
   * `amount` is the amount in floating point format without taking into account the token decimals
   */
  static createFrom(params: ITokenAmountData): ITokenAmount {
    return new TokenAmount(params)
  }

  /**
   * @name createFromBaseUnit
   * @param params Token amount data to create the instance
   * @returns The resulting TokenAmount
   *
   * `amount` is the integer amount including all the decimals of the token
   *
   * i.e.: amount in base unit (1eth = 1000000000000000000, 1btc = 100000000, etc...)
   */
  static createFromBaseUnit(params: ITokenAmountData): ITokenAmount {
    const amount = new BigNumber(params.amount)
      .div(new BigNumber(10).pow(new BigNumber(params.token.decimals)))
      .toString()
    return new TokenAmount({ token: params.token, amount: amount })
  }

  /** METHODS */

  /** @see ITokenAmount.add */
  add(tokenToAdd: ITokenAmount): ITokenAmount {
    this._validateSameToken(tokenToAdd)

    return new TokenAmount({
      token: this.token,
      amount: this.toBN().plus(tokenToAdd.toBN()).toString(),
    })
  }

  /** @see ITokenAmount.subtract */
  subtract(tokenToSubstract: ITokenAmount): ITokenAmount {
    this._validateSameToken(tokenToSubstract)

    return new TokenAmount({
      token: this.token,
      amount: this.toBN().minus(tokenToSubstract.toBN()).toString(),
    })
  }

  /** @see ITokenAmount.multiply */
  multiply(multiplier: string | number | IPercentage | IPrice): ITokenAmount {
    const result = isPercentage(multiplier)
      ? multiplyTokenAmountByPercentage(this, multiplier)
      : isPrice(multiplier)
        ? multiplyTokenAmountByPrice(this, multiplier)
        : {
            token: this.token,
            amount: this.toBN().times(multiplier).toString(),
          }

    if (isFiatCurrencyAmount(result)) {
      throw new Error(
        'Multiplying this token amount by this price would generate a fiat currency amount, which is not supported. Instead multiply the price by the token amount',
      )
    }

    return new TokenAmount(result)
  }

  /** @see ITokenAmount.divide */
  divide(divisor: string | number | IPercentage | IPrice): ITokenAmount {
    const result = isPercentage(divisor)
      ? divideTokenAmountByPercentage(this, divisor)
      : isPrice(divisor)
        ? divideTokenAmountByPrice(this, divisor)
        : { token: this.token, amount: this.toBN().div(divisor).toString() }

    if (isFiatCurrencyAmount(result)) {
      throw new Error(
        'Dividing this token amount by this price would generate a fiat currency amount, which is not supported. Instead divide the price by the token amount',
      )
    }

    return new TokenAmount(result)
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `${this.amount} ${this.token.symbol}`
  }

  toBaseUnit(): string {
    return new BigNumber(this.amount).times(this._baseUnitFactor).toFixed(0)
  }

  /** @see ITokenAmount.toBN */
  toBN(): BigNumber {
    return new BigNumber(this.amount)
  }

  /** PRIVATE */
  private _validateSameToken(tokenAmount: ITokenAmount): void {
    if (tokenAmount.token.symbol !== this.token.symbol) {
      throw new Error(
        `Token symbols do not match: ${tokenAmount.token.symbol} !== ${this.token.symbol}`,
      )
    }
  }
}

SerializationService.registerClass(TokenAmount)
