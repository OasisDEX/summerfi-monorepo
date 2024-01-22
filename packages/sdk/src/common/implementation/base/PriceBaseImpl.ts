import { Price, Token } from '~sdk/common'
import { Currency } from '~sdk/common'
import { isToken } from '~sdk/utils/TypeCheckers'

export class PriceBaseImpl implements Price {
  private static readonly DEFAULT_QUOTE_TOKEN = Currency.USD

  public readonly value: string
  public readonly baseToken: Token
  public readonly quoteToken?: Token | Currency

  constructor(params: { value: string; baseToken: Token; quoteToken?: Token | Currency }) {
    this.value = params.value
    this.baseToken = params.baseToken
    this.quoteToken = params.quoteToken ? params.quoteToken : PriceBaseImpl.DEFAULT_QUOTE_TOKEN
  }

  public static from(params: { value: string; baseToken: Token; quoteToken?: Token }): Price {
    return new PriceBaseImpl(params)
  }

  public toString(): string {
    const quoteSymbol = isToken(this.quoteToken) ? this.quoteToken.symbol : this.quoteToken
    return `${this.value} ${this.baseToken.symbol}/${quoteSymbol}`
  }
}
