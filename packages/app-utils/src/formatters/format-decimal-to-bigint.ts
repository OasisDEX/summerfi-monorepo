import { cleanAmount } from './clean-amount'

/**
 * Converts a decimal to a BigInt with specified decimal places
 * @param decimalStr - The decimal number as a string (e.g., "123.456")
 * @param decimals - Number of decimal places to maintain (default: 18)
 * @returns A BigInt scaled by the specified number of decimal places
 * @throws {Error} If the input string format is invalid
 */
export const formatDecimalToBigInt = (
  decimalStr?: string | number,
  decimals: number = 18,
): bigint => {
  if (!decimalStr) {
    return 0n
  }

  // Remove any whitespace, commas, and validate input
  const cleanStr = cleanAmount(decimalStr.toString().trim())

  if (!/^\d*\.?\d+$/u.test(cleanStr)) {
    throw new Error('Invalid decimal string format')
  }

  // Split into integer and decimal parts
  const [integerPart, decimalPart = ''] = cleanStr.split('.')

  // Pad or truncate decimal part according to decimals parameter
  const adjustedDecimal =
    decimalPart.length >= decimals
      ? decimalPart.slice(0, decimals) // truncate if longer
      : decimalPart + '0'.repeat(decimals - decimalPart.length) // pad if shorter

  return BigInt(integerPart + adjustedDecimal)
}
