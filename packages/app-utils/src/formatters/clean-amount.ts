/**
 * Removes commas from a numeric string
 * @param amount - The amount string | number | undefined that may contain commas
 * @returns The amount string with all commas removed
 */
export const cleanAmount = (amount: string | number | undefined): string => {
  if (!amount) {
    return ''
  }

  return amount.toString().replace(/,/gu, '')
}
