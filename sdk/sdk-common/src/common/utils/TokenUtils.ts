import { Token } from "../implementation/Token";
import { Price } from "../implementation/Price";
import { TokenAmount } from "../implementation/TokenAmount";

export function isSameTokens(a: Token, b: Token): boolean {
  return (
    a.address.value.toLowerCase() === b.address.value.toLowerCase() &&
    a.chainInfo.chainId === b.chainInfo.chainId
  )
}

export function exchange(tokenAmount: TokenAmount, price: Price) {
    if (!(price.quoteToken instanceof Token)) {
        throw new Error('Quote token is not a Token, (Currently currency is not supported)')
      }
      
      if (!isSameTokens(tokenAmount.token, price.quoteToken)) {
        throw new Error('Price needs to be quoted in the same token as the tokenAmount')
      }

      return TokenAmount.createFrom({
        token:  price.baseToken,
        amount: tokenAmount.toBN().div(price.toBN()).toString(),
      })
}