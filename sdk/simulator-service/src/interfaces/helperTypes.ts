// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Tail<T extends readonly any[]> = ((...t: T) => void) extends (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  h: any,
  ...r: infer R
) => void
  ? R
  : never
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Head<T extends readonly any[]> = T extends [infer H, ...any] ? H : never
export type EmptyArray = readonly []
export type Where<T, U> = T extends U ? T : never
export type Unpack<T> = T extends Promise<infer U> ? U : T extends Array<infer Y> ? Y : never
