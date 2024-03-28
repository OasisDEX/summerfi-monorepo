import { TokenAmount, type Token } from '@summerfi/sdk-common/common'

export function getTokenBalance(token: Token, balances: Record<string, TokenAmount>): TokenAmount {
  return balances[token.address.value] || TokenAmount.createFrom({ amount: '0', token })
}

export function addBalance(
  amount: TokenAmount,
  balance: Record<string, TokenAmount>,
): Record<string, TokenAmount> {
  return {
    ...balance,
    [amount.token.address.value]: balance[amount.token.address.value]
      ? balance[amount.token.address.value].add(amount)
      : amount,
  }
}

export function subtractBalance(
  amount: TokenAmount,
  balance: Record<string, TokenAmount>,
): Record<string, TokenAmount> {
  return {
    ...balance,
    [amount.token.address.value]: balance[amount.token.address.value]
      ? balance[amount.token.address.value].subtract(amount)
      : TokenAmount.createFrom({ amount: amount.toBN().negated().toString(), token: amount.token }),
  }
}
