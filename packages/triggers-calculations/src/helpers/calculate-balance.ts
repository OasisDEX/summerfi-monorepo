import { Price, PRICE_DECIMALS_NUMBER, Token, TokenBalance } from '@summerfi/triggers-shared'

export const calculateBalance = (from: TokenBalance, to: Token, fromPrice: Price): TokenBalance => {
  const balance =
    (from.balance * fromPrice * 10n ** BigInt(to.decimals)) /
    10n ** BigInt(PRICE_DECIMALS_NUMBER + from.token.decimals)
  return {
    balance,
    token: to,
  }
}
