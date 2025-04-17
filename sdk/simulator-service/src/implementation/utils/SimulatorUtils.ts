import type { ReferenceableField, SimulationStrategy, ValueReference } from '@summerfi/sdk-common'
import type { Tail } from '../../interfaces/helperTypes'

export function makeStrategy<T extends Readonly<SimulationStrategy>>(strategy: T): Readonly<T> {
  return strategy
}

export function isValueReference<T>(value: ReferenceableField<T>): value is ValueReference<T> {
  return (
    (value as ValueReference<T>).path !== undefined &&
    (value as ValueReference<T>).estimatedValue !== undefined
  )
}

export function getValueFromReference<T>(referenceableValue: ReferenceableField<T>): T {
  if (isValueReference(referenceableValue)) {
    return referenceableValue.estimatedValue
  }
  return referenceableValue
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
