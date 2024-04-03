import { TokenAmount, type Token } from '@summerfi/sdk-common/common'
import { BalancesRecord } from '../../types/Types'

// TODO: This should be transformed into a proper class, as we are passing the balances record
// TODO: to each call
export function getTokenBalance(token: Token, balances: BalancesRecord): TokenAmount {
  return balances[token.address.value] || TokenAmount.createFrom({ amount: '0', token })
}

export function addBalance(amount: TokenAmount, balance: BalancesRecord): BalancesRecord {
  return {
    ...balance,
    [amount.token.address.value]: balance[amount.token.address.value]
      ? balance[amount.token.address.value].add(amount)
      : amount,
  }
}

export function subtractBalance(amount: TokenAmount, balance: BalancesRecord): BalancesRecord {
  return {
    ...balance,
    [amount.token.address.value]: balance[amount.token.address.value]
      ? balance[amount.token.address.value].subtract(amount)
      : TokenAmount.createFrom({ amount: amount.toBN().negated().toString(), token: amount.token }),
  }
}
