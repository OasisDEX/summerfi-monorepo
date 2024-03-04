import { TokenAmount, type Token } from '@summerfi/sdk-common/common/implementation'
import type {
  ReferenceableField,
  SimulationStrategy,
  ValueReference,
} from '@summerfi/sdk-common/simulation'
import type { Tail } from '~swap-service/interfaces/helperTypes'

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

export function tail<T extends readonly any[]>(arr: T): Tail<T> {
  const [, ...rest] = arr

  return rest as any as Tail<T>
}
