import {
  type IPrice,
  type IPriceData,
  isPrice,
  PriceMulDivReturnType,
  PriceMulDivParamType,
} from '../interfaces/IPrice'
import { isToken } from '../interfaces/IToken'
import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { Token } from './Token'
import { Denomination } from '../aliases/Denomination'
import { isFiatCurrency } from '../enums'
import { isTokenAmount } from '../interfaces'
import { isFiatCurrencyAmount } from '../interfaces/IFiatCurrencyAmount'
import {
  divideFiatCurrencyAmountByPrice,
  dividePriceByPrice,
  divideTokenAmountByPrice,
  multiplyFiatCurrencyAmountByPrice,
  multiplyPriceByPrice,
  multiplyTokenAmountByPrice,
} from '../utils/PriceUtils'
import { FiatCurrencyAmount } from './FiatCurrencyAmount'
import { TokenAmount } from './TokenAmount'

/**
 * @class Price
 * @see IPrice
 */
export class Price implements IPrice {
  readonly value: string
  readonly base: Denomination
  readonly quote: Denomination

  /** Extracted symbol from the base */
  private readonly _baseSymbol: string
  /** Extracted symbol from the quote */
  private readonly _quoteSymbol: string

  /** FACTORY */
  static createFrom(params: IPriceData): IPrice {
    return new Price(params)
  }

  /** CONSTRUCTOR */

  /** Sealed constructor */
  private constructor(params: IPriceData) {
    this.value = params.value

    if (isToken(params.base)) {
      this.base = Token.createFrom(params.base)
      this._baseSymbol = this.base.symbol
    } else {
      this.base = params.base
      this._baseSymbol = this.base
    }

    if (isToken(params.quote)) {
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
    this._validateSameBaseToken(otherPrice)

    return Price.createFrom({
      value: this.toBN().minus(otherPrice.toBN()).toString(),
      base: this.base,
      quote: this.quote,
    })
  }

  /** @see IPrice.multiply */
  multiply<
    InputParams extends PriceMulDivParamType,
    ReturnType = PriceMulDivReturnType<InputParams>,
  >(multiplier: InputParams): ReturnType {
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

    if (isTokenAmount(result)) {
      return TokenAmount.createFrom(result) as ReturnType
    } else {
      return FiatCurrencyAmount.createFrom(result) as ReturnType
    }
  }

  /** @see IPrice.divide */
  divide<InputParams extends PriceMulDivParamType, ReturnType = PriceMulDivReturnType<InputParams>>(
    divider: InputParams,
  ): ReturnType {
    if (isPrice(divider)) {
      const result = dividePriceByPrice(this, divider)
      return Price.createFrom(result) as ReturnType
    }

    if (!isTokenAmount(divider) && !isFiatCurrencyAmount(divider)) {
      return new Price({
        value: this.toBN().div(divider).toString(),
        base: this.base,
        quote: this.quote,
      }) as ReturnType
    }

    const result = isTokenAmount(divider)
      ? divideTokenAmountByPrice(divider, this)
      : divideFiatCurrencyAmountByPrice(divider, this)

    if (isTokenAmount(result)) {
      return TokenAmount.createFrom(result) as ReturnType
    } else {
      return FiatCurrencyAmount.createFrom(result) as ReturnType
    }
  }

  /** @see IPrice.toBN */
  toBN(): BigNumber {
    return new BigNumber(this.value)
  }

  /** @see IPrice.toString */
  toString(): string {
    return `${this.value} ${this._baseSymbol}/${this._quoteSymbol}`
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

  /**
   * @name _hasBaseSameToThisQuote
   * @param price Price to compare against
   * @returns true if the price base is the same as this price quote
   */
  private _hasBaseSameToThisQuote(price: IPrice): boolean {
    if (isToken(this.quote)) {
      if (isFiatCurrency(price.base) || !this.quote.equals(price.base)) {
        return false
      }
    } else {
      if (!isFiatCurrency(price.base) || this.quote !== price.base) {
        return false
      }
    }

    return true
  }

  /**
   * @name _hasQuoteSameToThisBase
   * @param price Price to compare against
   * @returns true if the price quote is the same as this price base
   */
  private _hasQuoteSameToThisBase(price: IPrice): boolean {
    if (isToken(this.base)) {
      if (!isFiatCurrency(price.quote) && this.base.equals(price.quote)) {
        return false
      }
    } else {
      if (!isFiatCurrency(price.quote) || this.base !== price.quote) {
        return false
      }
    }

    return true
  }
}

SerializationService.registerClass(Price)
