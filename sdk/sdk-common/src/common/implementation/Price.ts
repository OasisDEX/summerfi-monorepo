import { IPrice, IPriceData } from '../interfaces/IPrice'
import { isToken } from '../interfaces/IToken'
import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { CurrencySymbol } from '../enums/CurrencySymbol'
import { Token } from './Token'
import { isSameTokens } from '../utils/TokenUtils'

/**
 * @class Price
 * @see IPrice
 */
export class Price implements IPrice {
  readonly value: string
  readonly baseToken: Token
  readonly quoteToken: Token | CurrencySymbol

  /** Factory method */
  static createFrom(params: IPriceData): Price {
    return new Price(params)
  }

  /** Sealed constructor */
  private constructor(params: IPriceData) {
    this.value = params.value
    this.baseToken = Token.createFrom(params.baseToken)
    this.quoteToken = isToken(params.quoteToken)
      ? Token.createFrom(params.quoteToken)
      : params.quoteToken
  }

  toString(): string {
    if (isToken(this.quoteToken)) {
      return `${this.value} ${this.baseToken.symbol}/${this.quoteToken.symbol}`
    } else {
      return `${this.value} ${this.baseToken.symbol}/${this.quoteToken}`
    }
  }

  /** @see IPrice.toBN */
  toBN(): BigNumber {
    return new BigNumber(this.value)
  }

  /** @see IPrice.hasSameQuoteToken */
  hasSameQuoteToken(b: Price): boolean {
    if (isToken(this.quoteToken) && isToken(b.quoteToken)) {
      return isSameTokens(this.quoteToken, b.quoteToken)
    }

    return this.quoteToken === b.quoteToken
  }

  /** @see IPrice.div */
  div(b: Price) {
    if (!this.hasSameQuoteToken(b)) {
      throw new Error('Token bases must be the same')
    }

    return Price.createFrom({
      value: this.toBN().div(b.toBN()).toString(),
      baseToken: this.baseToken,
      quoteToken: b.baseToken,
    })

    // TODO: case when the quotes are the same
  }
}

SerializationService.registerClass(Price)
