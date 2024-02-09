export type Version = number

export type Versioned<T> = {
  version: Version
  value: T
}
