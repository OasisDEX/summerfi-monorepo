export function JSONStringifyWithBigInt(value: unknown, space?: string | number): string {
  return JSON.stringify(
    value,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    space,
  )
}
