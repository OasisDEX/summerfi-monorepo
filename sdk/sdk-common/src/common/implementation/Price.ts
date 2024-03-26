import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { isToken } from '../../utils/isToken'
import { CurrencySymbol } from '../enums/CurrencySymbol'
import { Token } from './Token'

interface IPrice {
  value: string
  baseToken: Token
  quoteToken: Token | CurrencySymbol
}

/**
 * @class Price
 * @description Represents a price of a token (baseToken) in a given currency (quoteToken)
 */
export class Price implements IPrice {
  private static readonly DEFAULT_QUOTE_TOKEN = CurrencySymbol.USD

  readonly value: string
  readonly baseToken: Token
  readonly quoteToken: Token | CurrencySymbol

  private constructor(params: IPrice) {
    this.value = params.value
    this.baseToken = params.baseToken
    this.quoteToken = params.quoteToken
  }

  static createFrom(params: {
    value: string
    baseToken: Token
    quoteToken?: Token | CurrencySymbol
  }): Price {
    return new Price({
      value: params.value,
      baseToken: params.baseToken,
      quoteToken: params.quoteToken || Price.DEFAULT_QUOTE_TOKEN,
    })
  }

  toString(): string {
    if (isToken(this.quoteToken)) {
      return `${this.value} ${this.baseToken.symbol}/${this.quoteToken.symbol}`
    } else {
      return `${this.value} ${this.baseToken.symbol}/${this.quoteToken}`
    }
  }

  public toBN(): BigNumber {
    return new BigNumber(this.value)
  }
}

SerializationService.registerClass(Price)
