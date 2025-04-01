const inputFormatConfig = {
  minimumFractionDigits: 0, // Minimum number of fraction digits
  maximumFractionDigits: 6, // Maximum number of fraction digits
}

/**
 * Validates whether a given string is a valid numeric input.
 *
 * This function checks if the input string represents a valid numeric value, allowing for numbers,
 * decimal points, and excluding commas (which are removed before validation).
 *
 * @param input - The input string to validate.
 * @returns A boolean indicating whether the input is a valid numeric value.
 */
const isValidNumericInputValue = (input: string) => {
  const prepInput = input.replaceAll(',', '')

  if (prepInput === '') return true
  const regex = /^[\p{N}.]+$/u

  return regex.test(prepInput)
}

/**
 * Formats a numeric input string according to the `inputFormatConfig`, or trims the input if invalid.
 *
 * This function checks if the input is valid using `isValidNumericInputValue`. If the input is invalid, it returns the input with the last character removed.
 * If valid, it formats the integer and decimal parts of the input string according to US number formatting, while retaining proper decimal placement.
 *
 * @param value - The input string to be formatted or trimmed.
 * @returns A formatted string if valid or the input with the last character removed if invalid.
 */
export const mapNumericInput = (value: string): string => {
  if (!isValidNumericInputValue(value)) {
    return value.slice(0, -1)
  }

  const [int, dec] = value.split('.')
  const withDot = value.includes('.')

  // If we have a decimal point but no decimal digits yet (e.g., "123.")
  if (withDot && !dec) {
    return `${new Intl.NumberFormat('en-US', inputFormatConfig).format(Number(int.replaceAll(',', '')))}.`
  }

  // If we have decimal digits, preserve them exactly as typed
  if (withDot && dec) {
    return `${new Intl.NumberFormat('en-US', inputFormatConfig).format(Number(int.replaceAll(',', '')))}.${dec}`
  }

  // No decimal point, just format the integer
  return new Intl.NumberFormat('en-US', inputFormatConfig).format(Number(int.replaceAll(',', '')))
}
