export const hasAnyDefined = (...args: unknown[]): boolean => {
  return args.some((arg) => arg !== undefined)
}
