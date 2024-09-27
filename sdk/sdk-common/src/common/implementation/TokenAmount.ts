import { BigNumber } from 'bignumber.js'
import { Token } from './Token'
import { SerializationService } from '../../services/SerializationService'
import {
  ITokenAmount,
  ITokenAmountData,
  TokenAmountMulDivParamType,
  TokenAmountMulDivReturnType,
} from '../interfaces/ITokenAmount'
import { isPercentage } from '../interfaces/IPercentage'
import {
  divideTokenAmountByPercentage,
  multiplyTokenAmountByPercentage,
} from '../utils/PercentageUtils'
import { isPrice } from '../interfaces/IPrice'

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
  multiply<
    InputParams extends TokenAmountMulDivParamType,
    ReturnType = TokenAmountMulDivReturnType<InputParams>,
  >(multiplier: InputParams): ReturnType {
    if (isPrice(multiplier)) {
      return multiplier.multiply(this)
    }

    const result = isPercentage(multiplier)
      ? multiplyTokenAmountByPercentage(this, multiplier)
      : {
          token: this.token,
          amount: this.toBN().times(multiplier).toString(),
        }

    return new TokenAmount(result) as ReturnType
  }

  /** @see ITokenAmount.divide */
  divide<
    InputParams extends TokenAmountMulDivParamType,
    ReturnType = TokenAmountMulDivReturnType<InputParams>,
  >(divisor: InputParams): ReturnType {
    if (isPrice(divisor)) {
      return divisor.invert().multiply(this)
    }

    const result = isPercentage(divisor)
      ? divideTokenAmountByPercentage(this, divisor)
      : { token: this.token, amount: this.toBN().div(divisor).toString() }

    return new TokenAmount(result) as ReturnType
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `${this.amount} ${this.token.symbol}`
  }

  toBaseUnit(): string {
    return new BigNumber(this.amount).times(this._baseUnitFactor).toFixed(0, BigNumber.ROUND_DOWN)
  }

  /** @see ITokenAmount.toBN */
  toBN(): BigNumber {
    return new BigNumber(this.amount)
  }

  /** @see ITokenAmount.isZero */
  isZero(): boolean {
    return this.toBN().isZero()
  }

  /** PRIVATE */
  private _validateSameToken(tokenAmount: ITokenAmount): void {
    // TODO: relaxed check by using only lowercase due to Portfolio and Product Hub not being
    // TODO: integrated in the SDK and using different symbols cases
    if (tokenAmount.token.symbol.toLowerCase() !== this.token.symbol.toLowerCase()) {
      throw new Error(
        `Token symbols do not match: ${tokenAmount.token.symbol} !== ${this.token.symbol}`,
      )
    }
  }
}

SerializationService.registerClass(TokenAmount)
