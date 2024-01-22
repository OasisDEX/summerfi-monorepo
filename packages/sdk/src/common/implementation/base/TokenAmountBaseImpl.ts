import { Token, TokenAmount } from '~sdk/common'

export class TokenAmountBaseImpl implements TokenAmount {
  public readonly token: Token
  public readonly amount: string

  constructor(token: Token, amount: string) {
    this.token = token
    this.amount = amount
  }

  public static create(token: Token, amount: string): TokenAmount {
    return new TokenAmountBaseImpl(token, amount)
  }

  public toString(): string {
    return `${this.amount} ${this.token.symbol}`
  }
}
