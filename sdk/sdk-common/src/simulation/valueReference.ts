export interface ValueReference<T> {
  estimatedValue: T
  path: [string, string]
}

export type ReferenceableField<T> = T | ValueReference<T>
