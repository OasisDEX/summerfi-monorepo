/**
 * A reference to a value that is not directly available in the current context.
 *
 * This type is used when the actual value has to be read in the contracts in order to be used.
 *
 * Typically used for the DMA system, but can be repurposed for other use cases.
 */
export interface ValueReference<T> {
  estimatedValue: T
  path: [string, string]
}

/**
 * A field that can be either a value or a reference to a value.
 */
export type ReferenceableField<T> = T | ValueReference<T>

/**
 *
 * @param value Type guard for ValueReference
 * @returns true if the value is a ValueReference, false otherwise
 */
export function isValueReference<T>(value: unknown): value is ValueReference<T> {
  return typeof value === 'object' && value !== null && 'estimatedValue' in value && 'path' in value
}

/**
 * Get the value from a referenceable field.
 *
 * If the field is a reference, the estimated value is returned.
 * If the field is a value, the value is returned.
 *
 * @param reference The referenceable field
 *
 * @returns The value of the referenceable field
 */
export function getValueFromReference<T>(reference: ReferenceableField<T>): T {
  if (isValueReference(reference)) {
    return reference.estimatedValue
  }
  return reference
}
