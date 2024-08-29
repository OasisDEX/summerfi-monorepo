import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { FiatCurrency } from '../enums/FiatCurrency'
import {
  FiatCurrencyAmountMulDivParamType,
  FiatCurrencyAmountMulDivReturnType,
  IFiatCurrencyAmountData,
  __signature__,
  type IFiatCurrencyAmount,
} from '../interfaces/IFiatCurrencyAmount'
import { isPercentage } from '../interfaces/IPercentage'
import { isPrice } from '../interfaces/IPrice'
import {
  divideFiatCurrencyAmountByPercentage,
  multiplyFiatCurrencyAmountByPercentage,
} from '../utils/PercentageUtils'

/**
 * Type for the parameters of FiatCurrencyAmount
 */
export type FiatCurrencyAmountParameters = Omit<IFiatCurrencyAmountData, ''>

/**
 * @class FiatCurrencyAmount
 * @see IFiatCurrencyAmount
 */
export class FiatCurrencyAmount implements IFiatCurrencyAmount {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  readonly fiat: FiatCurrency
  readonly amount: string

  /** FACTORY */
  static createFrom(params: FiatCurrencyAmountParameters): IFiatCurrencyAmount {
    return new FiatCurrencyAmount(params)
  }

  /** CONSTRUCTOR */
  private constructor(params: FiatCurrencyAmountParameters) {
    this.fiat = params.fiat
    this.amount = params.amount
  }

  /** METHODS */

  /** @see IFiatCurrencyAmount.add */
  add(fiatToAdd: FiatCurrencyAmount): IFiatCurrencyAmount {
    this._validateSameFiatCurrency(fiatToAdd)

    return new FiatCurrencyAmount({
      fiat: this.fiat,
      amount: (Number(this.amount) + Number(fiatToAdd.amount)).toString(),
    })
  }

  /** @see IFiatCurrencyAmount.subtract */
  subtract(fiatToSubstract: FiatCurrencyAmount): IFiatCurrencyAmount {
    this._validateSameFiatCurrency(fiatToSubstract)

    return new FiatCurrencyAmount({
      fiat: this.fiat,
      amount: (Number(this.amount) - Number(fiatToSubstract.amount)).toString(),
    })
  }

  /** @see IFiatCurrencyAmount.multiply */
  multiply<
    InputParams extends FiatCurrencyAmountMulDivParamType,
    ReturnType = FiatCurrencyAmountMulDivReturnType<InputParams>,
  >(multiplier: InputParams): ReturnType {
    if (isPrice(multiplier)) {
      return multiplier.multiply(this)
    }

    const result = isPercentage(multiplier)
      ? multiplyFiatCurrencyAmountByPercentage(this, multiplier)
      : {
          fiat: this.fiat,
          amount: String(Number(this.amount) * Number(multiplier)),
        }

    return new FiatCurrencyAmount(result) as ReturnType
  }

  /** @see IFiatCurrencyAmount.divide */
  divide<
    InputParams extends FiatCurrencyAmountMulDivParamType,
    ReturnType = FiatCurrencyAmountMulDivReturnType<InputParams>,
  >(divisor: InputParams): ReturnType {
    if (isPrice(divisor)) {
      return divisor.invert().multiply(this)
    }

    const result = isPercentage(divisor)
      ? divideFiatCurrencyAmountByPercentage(this, divisor)
      : {
          fiat: this.fiat,
          amount: String(Number(this.amount) / Number(divisor)),
        }

    return new FiatCurrencyAmount(result) as ReturnType
  }

  /** @see IValueConverter.toBigNumber */
  toSolidityValue(_: { decimals: number }): bigint {
    return BigInt(this.amount)
  }

  /** @see IValueConverter.toBigNumber */
  toBigNumber(): BigNumber {
    return new BigNumber(this.amount)
  }

  /** @see IPrintable.toString */
  toString(): string {
    return `${this.amount} ${this.fiat}`
  }

  /** PRIVATE */

  /**
   * @name _validateSameFiatCurrency
   * @param fiatCurrencyAmount FiatCurrencyAmount to validate against the instance
   * @throws Error if the fiat currency does not match
   *
   * Checks that the fiat currency of the provided FiatCurrencyAmount matches the instance
   */
  private _validateSameFiatCurrency(fiatCurrencyAmount: FiatCurrencyAmount): void {
    if (fiatCurrencyAmount.fiat !== this.fiat) {
      throw new Error(`Fiat currency does not match: ${fiatCurrencyAmount.fiat} !== ${this.fiat}`)
    }
  }
}

SerializationService.registerClass(FiatCurrencyAmount)
