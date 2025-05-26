import { safeBTOA } from './safe-b64'

/**
 * Converts a string to a URI-safe format.
 * This function uses base64 encoding with URI-safe characters.
 *
 * @param str - The string to convert to URI-safe format
 * @returns The URI-safe encoded string
 */
export const toUriSafe = (str: string): string => {
  return safeBTOA(str)
}
