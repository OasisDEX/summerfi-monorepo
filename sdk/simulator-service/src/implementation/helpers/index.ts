import { TokenAmount, type Token } from '@summerfi/sdk-common/common'
import type {
  ReferencableField,
  SimulationStrategy,
  ValueReference,
} from '@summerfi/sdk-common/simulation'
import type { Tail } from '~swap-service/interfaces/helperTypes'

export function makeStrategy<T extends SimulationStrategy>(strategy: T): T {
  return strategy
}

export function isReference<T>(value: ReferencableField<T>): value is ValueReference<T> {
  return (
    (value as ValueReference<T>).path !== undefined &&
    (value as ValueReference<T>).estimatedValue !== undefined
  )
}

export function getReferencedValue<T>(referencableValue: ReferencableField<T>): T {
  if (isReference(referencableValue)) {
    return referencableValue.estimatedValue
  }
  return referencableValue
}

export function getTokenBalance(token: Token, balances: Record<string, TokenAmount>): TokenAmount {
  return balances[token.address.hexValue] || TokenAmount.createFrom({ amount: '0', token })
}

export function addBalance(
  amount: TokenAmount,
  balance: Record<string, TokenAmount>,
): Record<string, TokenAmount> {
  return {
    ...balance,
    [amount.token.address.hexValue]: balance[amount.token.address.hexValue]
      ? balance[amount.token.address.hexValue].add(amount)
      : amount,
  }
}

export function subtractBalance(
  amount: TokenAmount,
  balance: Record<string, TokenAmount>,
): Record<string, TokenAmount> {
  return {
    ...balance,
    [amount.token.address.hexValue]: balance[amount.token.address.hexValue].subtract(amount),
  }
}

export function switchCheck(): never {
  throw new Error('Run out of cases')
}

export function tail<T extends readonly unknown[]>(arr: T): Tail<T> {
  const [, ...rest] = arr

  return rest as unknown as Tail<T>
}
