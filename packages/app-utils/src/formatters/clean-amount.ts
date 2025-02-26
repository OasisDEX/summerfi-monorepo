/**
 * Removes commas from a numeric string
 * @param amount - The amount string that may contain commas
 * @returns The amount string with all commas removed
 */
export const cleanAmount = (amount: string | undefined): string => {
  if (!amount) {
    return ''
  }

  return amount.replace(/,/gu, '')
}
