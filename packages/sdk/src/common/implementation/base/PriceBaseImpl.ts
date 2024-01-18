import { Price, Token } from '~sdk/common'

/**
 * @class Price
 * @see Price
 */
export class PriceBaseImpl implements Price {
  /// Instance Attributes
  public readonly value: string
  public readonly baseToken: Token
  public readonly quoteToken?: Token

  /// Constructor
  private constructor(params: { value: string; baseToken: Token; quoteToken?: Token }) {
    this.value = params.value
    this.baseToken = params.baseToken
    this.quoteToken = params.quoteToken
  }

  /// Static Methods
  from(params: { value: string; baseToken: Token; quoteToken?: Token }): Price {
    return new PriceBaseImpl(params)
  }

  /// Instance Methods

  /**
   * @see Printable.toString
   */
  public toString(): string {
    return `${this.value} ${this.baseToken.symbol}/${
      this.quoteToken ? this.quoteToken.symbol : 'USD'
    }`
  }
}
