import { isToken } from '~sdk/utils'
import { Printable } from './Printable'
import { Token } from './Token'

/**
 * @enum Currency
 * @description To be used for printing purposes only
 */
export enum Currency {
  USD = 'USD',
}

/**
 * @class Price
 * @description Represents a price of a token (baseToken) in a given currency (quoteToken)
 */
export class Price implements Printable {
  private static readonly DEFAULT_QUOTE_TOKEN = Currency.USD

  public readonly value: string
  public readonly baseToken: Token
  public readonly quoteToken?: Token | Currency

  private constructor(params: { value: string; baseToken: Token; quoteToken?: Token | Currency }) {
    this.value = params.value
    this.baseToken = params.baseToken
    this.quoteToken = params.quoteToken ? params.quoteToken : Price.DEFAULT_QUOTE_TOKEN
  }

  public static createFrom(params: { value: string; baseToken: Token; quoteToken?: Token }): Price {
    return new Price(params)
  }

  public toString(): string {
    const quoteSymbol = isToken(this.quoteToken) ? this.quoteToken.symbol : this.quoteToken
    return `${this.value} ${this.baseToken.symbol}/${quoteSymbol}`
  }
}
