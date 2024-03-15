import { SerializationService } from '../../services/SerializationService'
import { CurrencySymbol } from '../enums/CurrencySymbol'
import { Token } from './Token'

interface IPriceSerialized {
  value: string
  baseToken: Token
  quoteToken?: Token | CurrencySymbol
}

/**
 * @class Price
 * @description Represents a price of a token (baseToken) in a given currency (quoteToken)
 */
export class Price implements IPriceSerialized {
  private static readonly DEFAULT_QUOTE_TOKEN = CurrencySymbol.USD

  readonly value: string
  readonly baseToken: Token
  readonly quoteToken: Token | CurrencySymbol

  private constructor(params: IPriceSerialized) {
    this.value = params.value
    this.baseToken = params.baseToken
    this.quoteToken = params.quoteToken ? params.quoteToken : Price.DEFAULT_QUOTE_TOKEN
  }

  static createFrom(params: { value: string; baseToken: Token; quoteToken?: Token }): Price {
    return new Price(params)
  }

  toString(): string {
    // if (isToken(this.quoteToken)) {
    //   return `${this.value} ${this.baseToken.symbol}/${this.quoteToken.symbol}`
    // } else {
    //   return `${this.value} ${this.baseToken.symbol}/${this.quoteToken}`
    // }
    return ''
  }
}

SerializationService.registerClass(Price)
