import { IPrice, IPriceData } from '../interfaces/IPrice'
import { isToken } from '../interfaces/IToken'
import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { CurrencySymbol } from '../enums/CurrencySymbol'
import { Token } from './Token'

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

  toBN(): BigNumber {
    return new BigNumber(this.value)
  }
}

SerializationService.registerClass(Price)
