import { type Token } from '~sdk-common/common/implementation/Token'
import { SerializationService } from '~sdk-common/services/SerializationService'
import { CurrencySymbol } from '~sdk-common/common/enums'
import { isToken } from '~sdk-common/utils/isToken'

interface IPriceSerialized {
  value: string
  baseToken: Token
  quoteToken: Token | CurrencySymbol
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
    this.quoteToken = params.quoteToken
  }

  static createFrom(params: { value: string; baseToken: Token; quoteToken?: Token | CurrencySymbol }): Price {
    return new Price({value: params.value, baseToken: params.baseToken, quoteToken: params.quoteToken || Price.DEFAULT_QUOTE_TOKEN})
  }

  toString(): string {
    const quoteSymbol = isToken(this.quoteToken) ? this.quoteToken.symbol : this.quoteToken
    return `${this.value} ${this.baseToken.symbol}/${quoteSymbol}`
  }
}

SerializationService.registerClass(Price)
