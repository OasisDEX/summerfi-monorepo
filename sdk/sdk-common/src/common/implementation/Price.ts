import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { Denomination } from '../aliases/Denomination'
import { IPercentage, isPercentage } from '../interfaces'
import { isFiatCurrencyAmount } from '../interfaces/IFiatCurrencyAmount'
import {
  IPriceData,
  PriceMulParamType,
  PriceMulReturnType,
  __signature__,
  isPrice,
  type IPrice,
} from '../interfaces/IPrice'
import { isToken, isTokenData } from '../interfaces/IToken'
import { ITokenAmount, isTokenAmount, isTokenAmountData } from '../interfaces/ITokenAmount'
import {
  dividePriceByPercentage,
  dividePriceByPrice,
  multiplyFiatCurrencyAmountByPrice,
  multiplyPriceByPercentage,
  multiplyPriceByPrice,
  multiplyTokenAmountByPrice,
} from '../utils/PriceUtils'
import { FiatCurrencyAmount } from './FiatCurrencyAmount'
import { Token } from './Token'
import { TokenAmount } from './TokenAmount'

/**
 * Type for the parameters of Price
 */
export type PriceParameters = Omit<IPriceData, ''>

/**
 * @class Price
 * @see IPrice
 */
export class Price implements IPrice {
  /** SIGNATURE */
  readonly [__signature__] = __signature__

  /** ATTRIBUTES */
  readonly value: string
  readonly base: Denomination
  readonly quote: Denomination

  /** Extracted symbol from the base */
  private readonly _baseSymbol: string
  /** Extracted symbol from the quote */
  private readonly _quoteSymbol: string

  /** FACTORY */

  static createFrom(params: PriceParameters): IPrice {
    return new Price(params)
  }

  /**
   * Creates a price from the ratio of two token amounts
   *
   * @param numerator the token amount in the numerator
   * @param denominator the token amount in the denominator
   * @returns the price calculated from the amounts ratio of numerator divided by denominator
   *
   * @dev The denominator becomes the base of the price and the numerator becomes the quote
   */
  static createFromAmountsRatio(params: {
    numerator: ITokenAmount
    denominator: ITokenAmount
  }): IPrice {
    return new Price({
      value: new BigNumber(params.numerator.amount).div(params.denominator.amount).toString(),
      base: params.denominator.token,
      quote: params.numerator.token,
    })
  }

  /** CONSTRUCTOR */

  /** Sealed constructor */
  private constructor(params: PriceParameters) {
    this.value = params.value

    if (isTokenData(params.base)) {
      this.base = Token.createFrom(params.base)
      this._baseSymbol = this.base.symbol
    } else {
      this.base = params.base
      this._baseSymbol = this.base
    }

    if (isTokenData(params.quote)) {
      this.quote = Token.createFrom(params.quote)
      this._quoteSymbol = this.quote.symbol
    } else {
      this.quote = params.quote
      this._quoteSymbol = this.quote
    }
  }

  /** @see IPrice.hasSameQuote */
  hasSameQuote(otherPrice: IPrice): boolean {
    if (isToken(this.quote) && isToken(otherPrice.quote)) {
      return this.quote.equals(otherPrice.quote)
    }

    return this.quote === otherPrice.quote
  }

  /** @see IPrice.hasSameBase */
  hasSameBase(otherPrice: IPrice): boolean {
    if (isToken(this.base) && isToken(otherPrice.base)) {
      return this.base.equals(otherPrice.base)
    }

    return this.base === otherPrice.base
  }

  /** @see IPrice.hasSameDenominations */
  hasSameDenominations(otherPrice: IPrice): boolean {
    return this.hasSameBase(otherPrice) && this.hasSameQuote(otherPrice)
  }

  /** @see IPrice.add */
  add(otherPrice: IPrice): IPrice {
    this._validateSameDenominations(otherPrice)

    return Price.createFrom({
      value: this.toBN().plus(otherPrice.toBN()).toString(),
      base: this.base,
      quote: this.quote,
    })
  }

  /** @see IPrice.subtract */
  subtract(otherPrice: IPrice): IPrice {
    this._validateSameDenominations(otherPrice)

    return Price.createFrom({
      value: this.toBN().minus(otherPrice.toBN()).toString(),
      base: this.base,
      quote: this.quote,
    })
  }

  /** @see IPrice.multiply */
  multiply<InputParams extends PriceMulParamType, ReturnType = PriceMulReturnType<InputParams>>(
    multiplier: InputParams,
  ): ReturnType {
    if (isPercentage(multiplier)) {
      const result = multiplyPriceByPercentage(this, multiplier)
      return Price.createFrom(result) as ReturnType
    }

    if (isPrice(multiplier)) {
      const result = multiplyPriceByPrice(this, multiplier)
      return Price.createFrom(result) as ReturnType
    }

    if (!isTokenAmount(multiplier) && !isFiatCurrencyAmount(multiplier)) {
      return new Price({
        value: this.toBN().times(multiplier).toString(),
        base: this.base,
        quote: this.quote,
      }) as ReturnType
    }

    const result = isTokenAmount(multiplier)
      ? multiplyTokenAmountByPrice(multiplier, this)
      : multiplyFiatCurrencyAmountByPrice(multiplier, this)

    if (isTokenAmountData(result)) {
      return TokenAmount.createFrom(result) as ReturnType
    } else {
      return FiatCurrencyAmount.createFrom(result) as ReturnType
    }
  }

  /** @see IPrice.divide */
  divide(divider: string | number | IPrice | IPercentage): IPrice {
    if (isPercentage(divider)) {
      const result = dividePriceByPercentage(this, divider)
      return Price.createFrom(result)
    }

    if (isPrice(divider)) {
      const result = dividePriceByPrice(this, divider)
      return Price.createFrom(result)
    }

    return new Price({
      value: this.toBN().div(divider).toString(),
      base: this.base,
      quote: this.quote,
    })
  }

  /** @see IPrice.invert */
  invert(): IPrice {
    return Price.createFrom({
      value: new BigNumber(1).div(this.toBN()).toString(),
      base: this.quote,
      quote: this.base,
    })
  }

  /** @see IPrice.toBN */
  toBN(): BigNumber {
    return new BigNumber(this.value)
  }

  /** @see IPrice.toString */
  toString(): string {
    return `${this.value} ${this._quoteSymbol}/${this._baseSymbol}`
  }

  /** @see IPrice.isLessThan */
  isLessThan(otherPrice: IPrice): boolean {
    this._validateSameDenominations(otherPrice)

    return this.toBN().lt(otherPrice.toBN())
  }

  /** @see IPrice.isLessThanOrEqual */
  isLessThanOrEqual(otherPrice: IPrice): boolean {
    this._validateSameDenominations(otherPrice)

    return this.toBN().lte(otherPrice.toBN())
  }

  /** @see IPrice.isGreaterThan */
  isGreaterThan(otherPrice: IPrice): boolean {
    this._validateSameDenominations(otherPrice)

    return this.toBN().gt(otherPrice.toBN())
  }

  /** @see IPrice.isGreaterThanOrEqual */
  isGreaterThanOrEqual(otherPrice: IPrice): boolean {
    this._validateSameDenominations(otherPrice)

    return this.toBN().gte(otherPrice.toBN())
  }

  /** @see IPrice.isZero */
  isZero(): boolean {
    return this.toBN().isZero()
  }

  /** @see IPrice.isEqual */
  isEqual(otherPrice: IPrice): boolean {
    this._validateSameDenominations(otherPrice)

    return this.toBN().eq(otherPrice.toBN())
  }

  /** PRIVATE */

  /**
   * @name _validateSameBaseToken
   * @param price Price to validate against the instance
   * @throws If the price base tokens do not match
   */
  private _validateSameBaseToken(price: IPrice): void {
    if (!this.hasSameBase(price)) {
      throw new Error(`Token bases do not match: ${this.base} !== ${price.base}`)
    }
  }

  /**
   * @name _validateSameQuoteToken
   * @param price Price to validate against the instance
   * @throws If the price quote tokens do not match
   */
  private _validateSameQuoteToken(price: IPrice): void {
    if (!this.hasSameQuote(price)) {
      throw new Error(`Token quotes do not match: ${this.quote} !== ${price.quote}`)
    }
  }

  /**
   * @name _validateSameDenominations
   * @param price Price to validate against the instance
   * @throws If the price base or quote tokens do not match
   */
  private _validateSameDenominations(price: IPrice): void {
    this._validateSameBaseToken(price)
    this._validateSameQuoteToken(price)
  }
}

SerializationService.registerClass(Price)
