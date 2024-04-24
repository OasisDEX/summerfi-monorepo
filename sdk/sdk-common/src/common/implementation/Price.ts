import { IPrice } from '../interfaces/IPrice'
import { isToken } from '../interfaces/IToken'
import { BigNumber } from 'bignumber.js'
import { SerializationService } from '../../services/SerializationService'
import { CurrencySymbol } from '../enums/CurrencySymbol'
import { Token } from './Token'
import { isSameTokens } from '../utils/TokenUtils'

/**
 * @class Price
 * @description Represents a price of a token (baseToken) in a given currency (quoteToken)
 * @description Base / Quote e.q. 2000 ETH / DAI
 * @description The financial representation (x ETH/DAI, Base/Quote) might be confusing as mathematically it is (x DAI/ETH, Quote/Base which means x DAI per 1 ETH)
 * @description x amount of quoted token for one unit of base token
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

  public hasSameQuoteToken(b: Price): boolean {
    if (isToken(this.quoteToken) && isToken(b.quoteToken)) {
      return isSameTokens(this.quoteToken, b.quoteToken)
    }

    return this.quoteToken === b.quoteToken
  }

  public div(b: Price) {
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
