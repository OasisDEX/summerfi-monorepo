export interface ValueReference<T> {
  estimatedValue: T
  path: [string, string]
}

export type ReferenceableField<T> = T | ValueReference<T>

export function isValueReference<T>(value: unknown): value is ValueReference<T> {
  return typeof value === 'object' && value !== null && 'estimatedValue' in value && 'path' in value
}

export function getValueFromReference<T>(reference: ReferenceableField<T>): T {
  if (isValueReference(reference)) {
    return reference.estimatedValue
  }
  return reference
}
