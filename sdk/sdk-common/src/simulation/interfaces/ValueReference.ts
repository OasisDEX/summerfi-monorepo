/**
 * A deferred reference to a value produced by an earlier simulation step, carrying an estimated
 * value plus the `path` used to resolve the real value at execution time.
 */
export interface ValueReference<T> {
  estimatedValue: T
  path: [string, string]
}

/** A field that may be either a concrete value of type `T` or a {@link ValueReference} to one. */
export type ReferenceableField<T> = T | ValueReference<T>

/**
 * Type guard that checks whether a value is a {@link ValueReference}.
 *
 * @param value - The value to test.
 * @returns `true` if the value is a {@link ValueReference}.
 */
export function isValueReference<T>(value: unknown): value is ValueReference<T> {
  return typeof value === 'object' && value !== null && 'estimatedValue' in value && 'path' in value
}

/**
 * Resolves a {@link ReferenceableField} to its concrete value, returning the estimated value when
 * it is a {@link ValueReference}.
 *
 * @param reference - The field to resolve.
 * @returns The concrete value of type `T`.
 */
export function getValueFromReference<T>(reference: ReferenceableField<T>): T {
  if (isValueReference(reference)) {
    return reference.estimatedValue
  }
  return reference
}
