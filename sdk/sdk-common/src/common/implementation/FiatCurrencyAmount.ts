import { SerializationService } from '../../services/SerializationService'
import {
  type IFiatCurrencyAmount,
  type IFiatCurrencyAmountData,
} from '../interfaces/IFiatCurrencyAmount'
import { FiatCurrency } from '../enums/FiatCurrency'
import { type IPercentage, isPercentage } from '../interfaces/IPercentage'
import {
  divideFiatCurrencyAmountByPercentage,
  multiplyFiatCurrencyAmountByPercentage,
} from '../utils/PercentageUtils'
import { type IPrice, isPrice, isTokenAmount } from '../interfaces'
import {
  divideFiatCurrencyAmountByPrice,
  multiplyFiatCurrencyAmountByPrice,
} from '../utils/PriceUtils'

/**
 * @class FiatCurrencyAmount
 * @see IFiatCurrencyAmount
 */
export class FiatCurrencyAmount implements IFiatCurrencyAmount {
  readonly fiat: FiatCurrency
  readonly amount: string

  /** CONSTRUCTOR */
  private constructor(params: IFiatCurrencyAmountData) {
    this.fiat = params.fiat
    this.amount = params.amount
  }

  /** FACTORY */
  static createFrom(params: IFiatCurrencyAmountData): IFiatCurrencyAmount {
    return new FiatCurrencyAmount(params)
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
  multiply(multiplier: string | number | IPercentage | IPrice): IFiatCurrencyAmount {
    const result = isPercentage(multiplier)
      ? multiplyFiatCurrencyAmountByPercentage(this, multiplier)
      : isPrice(multiplier)
        ? multiplyFiatCurrencyAmountByPrice(this, multiplier)
        : {
            fiat: this.fiat,
            amount: String(Number(this.amount) * Number(multiplier)),
          }

    if (isTokenAmount(result)) {
      throw new Error(
        'Multiplying this fiat currency amount by this price would generate a token amount, which is not supported. Instead multiply the price by the fiat currency amount',
      )
    }

    return new FiatCurrencyAmount(result)
  }

  /** @see IFiatCurrencyAmount.divide */
  divide(divisor: string | number | IPercentage | IPrice): IFiatCurrencyAmount {
    const result = isPercentage(divisor)
      ? divideFiatCurrencyAmountByPercentage(this, divisor)
      : isPrice(divisor)
        ? divideFiatCurrencyAmountByPrice(this, divisor)
        : {
            fiat: this.fiat,
            amount: String(Number(this.amount) / Number(divisor)),
          }

    if (isTokenAmount(result)) {
      throw new Error(
        'Dividing this fiat currency amount by this price would generate a token amount, which is not supported. Instead divide the price by the fiat currency amount',
      )
    }

    return new FiatCurrencyAmount(result)
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
