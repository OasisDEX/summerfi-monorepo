export interface ValueReference<T> {
    estimatedValue: T
    path: [string, string]
  }
  
export type ReferencableField<T> = T | ValueReference<T>