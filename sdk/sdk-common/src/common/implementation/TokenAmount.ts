import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { isPercentage } from '../interfaces/IPercentage'
import { IToken } from '../interfaces/IToken'
import {
  ITokenAmount,
  ITokenAmountData,
  TokenAmountMulDivParamType,
  TokenAmountMulDivReturnType,
  __signatureTokenAmount__,
  isPrice,
} from '../interfaces/ITokenAmount'
import {
  divideTokenAmountByPercentage,
  multiplyTokenAmountByPercentage,
} from '../utils/PercentageUtils'
import { Token } from './Token'

/**
 * Type for the parameters of TokenAmount
 */
export type TokenAmountParameters = Omit<ITokenAmountData, ''>

/**
 * @class TokenAmount
 * @see ITokenAmount
 */
export class TokenAmount implements ITokenAmount {
  /** SIGNATURE */
  readonly [__signatureTokenAmount__] = __signatureTokenAmount__

  /** ATTRIBUTES */
  readonly token: IToken
  readonly amount: string

  // This is protected because otherwise TypeScript is removing the type when transpiling and it causes errors.
  // Apparently using protected prevents this bug
  protected readonly _baseUnitFactor: BigNumber

  /** FACTORY */

  static createFrom(params: TokenAmountParameters): ITokenAmount {
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
  static createFromBaseUnit(params: TokenAmountParameters): ITokenAmount {
    const amount = new BigNumber(params.amount)
      .div(new BigNumber(10).pow(new BigNumber(params.token.decimals)))
      .toString()
    return new TokenAmount({ token: params.token, amount: amount })
  }

  /** CONSTRUCTOR  */

  /** Sealed constructor */
  private constructor(params: TokenAmountParameters) {
    this.token = Token.createFrom(params.token)
    this.amount = params.amount
    this._baseUnitFactor = new BigNumber(10).pow(new BigNumber(params.token.decimals))
  }

  /** METHODS */

  /** @see ITokenAmount.add */
  add(tokenToAdd: ITokenAmount): ITokenAmount {
    this._validateSameToken(tokenToAdd)

    return new TokenAmount({
      token: this.token,
      amount: this.toBigNumber().plus(tokenToAdd.toBigNumber()).toString(),
    })
  }

  /** @see ITokenAmount.subtract */
  subtract(tokenToSubstract: ITokenAmount): ITokenAmount {
    this._validateSameToken(tokenToSubstract)

    // TODO: refinance simulation fails when enabling the following check, need to investigate further
    // if (this.isLessThan(tokenToSubstract)) {
    //   throw SDKError.createFrom({
    //     type: SDKErrorType.Core,
    //     reason: 'Invalid subtraction',
    //     message: `Token amount is less than the amount to subtract: ${this.amount} < ${tokenToSubstract.amount}`,
    //   })
    // }

    return new TokenAmount({
      token: this.token,
      amount: this.toBigNumber().minus(tokenToSubstract.toBigNumber()).toString(),
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
          amount: this.toBigNumber().times(multiplier).toString(),
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
      : { token: this.token, amount: this.toBigNumber().div(divisor).toString() }

    return new TokenAmount(result) as ReturnType
  }

  /** @see ITokenAmount.isZero */
  isZero(): boolean {
    return this.toBigNumber().isZero()
  }

  /** @see ITokenAmount.isGreaterThan */
  isGreaterThan(tokenAmount: ITokenAmount): boolean {
    this._validateSameToken(tokenAmount)

    return this.toBigNumber().isGreaterThan(tokenAmount.toBigNumber())
  }

  /** @see ITokenAmount.isLessThan */
  isLessThan(tokenAmount: ITokenAmount): boolean {
    this._validateSameToken(tokenAmount)

    return this.toBigNumber().isLessThan(tokenAmount.toBigNumber())
  }

  /** @see ITokenAmount.isGreaterOrEqualThan */
  isGreaterOrEqualThan(tokenAmount: ITokenAmount): boolean {
    return !this.isLessThan(tokenAmount)
  }

  /** @see ITokenAmount.isLessOrEqualThan */
  isLessOrEqualThan(tokenAmount: ITokenAmount): boolean {
    return !this.isGreaterThan(tokenAmount)
  }

  /** @see ITokenAmount.isEqualTo */
  isEqualTo(tokenAmount: ITokenAmount): boolean {
    return this.toBigNumber().isEqualTo(tokenAmount.toBigNumber())
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `${this.amount} ${this.token.symbol}`
  }

  /** @see IValueConverter.toSolidityValue */
  toSolidityValue(params: { decimals: number } = { decimals: 0 }): bigint {
    const factor =
      params.decimals === 0 ? this._baseUnitFactor : new BigNumber(10).pow(params.decimals)
    return BigInt(new BigNumber(this.amount).times(factor).toFixed(0))
  }

  /** @see IValueConverter.toBigNumber */
  toBigNumber(): BigNumber {
    return new BigNumber(this.amount)
  }

  /** PRIVATE */

  /**
   * @name _validateSameToken
   * @description Validates that the token of the provided TokenAmount is the same as the current token
   *
   * @param tokenAmount TokenAmount to validate against the instance
   *
   * @remarks Throws an error if the token symbols do not match
   */
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

SerializationService.registerClass(TokenAmount, { identifier: 'TokenAmount' })
