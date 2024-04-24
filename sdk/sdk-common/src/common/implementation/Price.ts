import { IPrice } from '../interfaces/IPrice'
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

  private constructor(params: IPrice) {
    this.value = params.value
    this.baseToken = Token.createFrom(params.baseToken)
    this.quoteToken = isToken(params.quoteToken)
      ? Token.createFrom(params.quoteToken)
      : params.quoteToken
  }

  static createFrom(params: IPrice): Price {
    return new Price(params)
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
