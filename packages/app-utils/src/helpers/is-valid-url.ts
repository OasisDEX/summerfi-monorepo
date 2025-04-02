/**
 * Validates whether a given string is a valid URL.
 *
 * This function attempts to create a new `URL` object from the provided string.
 * If the string is a valid URL, it returns `true`; otherwise, it returns `false`.
 *
 * @param urlString - The string to be validated as a URL.
 * @returns `true` if the string is a valid URL, otherwise `false`.
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString)

    return true
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('URL is invalid', e)

    return false
  }
}
