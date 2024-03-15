import { TokenAmount, type Token } from '@summerfi/sdk-common/common'
import type {
  ReferenceableField,
  SimulationStrategy,
  ValueReference,
} from '@summerfi/sdk-common/simulation'
import type { Tail } from '~simulator-service/interfaces/helperTypes'

export function makeStrategy<T extends SimulationStrategy>(strategy: T): T {
  return strategy
}

export function isValueReference<T>(value: ReferenceableField<T>): value is ValueReference<T> {
  return (
    (value as ValueReference<T>).path !== undefined &&
    (value as ValueReference<T>).estimatedValue !== undefined
  )
}

export function getReferencedValue<T>(referencableValue: ReferenceableField<T>): T {
  if (isValueReference(referencableValue)) {
    return referencableValue.estimatedValue
  }
  return referencableValue
}

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
      : TokenAmount.createFrom({ amount: amount.toBN().negated().toString(), token: amount.token })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tail<T extends readonly any[]>(arr: T): Tail<T> {
  const [, ...rest] = arr
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rest as any as Tail<T>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function head<T extends readonly any[]>(arr: T): T[0] {
  return arr[0]
}