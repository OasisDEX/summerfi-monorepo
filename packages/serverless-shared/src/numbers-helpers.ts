export const isBigInt = (value: string) => {
  try {
    BigInt(value)
    return true
  } catch (error) {
    if (error instanceof SyntaxError) {
      return false
    }
    throw error
  }
}

export const safeParseBigInt = (value: string | undefined) => {
  if (value === undefined) {
    return undefined
  }

  if (isBigInt(value)) {
    return BigInt(value)
  }
  return undefined
}
