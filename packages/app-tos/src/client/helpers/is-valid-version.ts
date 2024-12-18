/**
 * Checks if the provided version string matches the expected version format.
 *
 * The expected format is: `[alphanumeric]_version-XX.XX.XXXX`
 * where `XX.XX.XXXX` represents a date in the format `dd.mm.yyyy`.
 *
 * example correct version: `test_version-26.06.2023`
 *
 * @param {string} version - The version string to validate.
 * @returns {boolean} - Returns `true` if the version string is valid, otherwise `false`.
 */
export const isValidVersion = (version: string): boolean => {
  const versionRegex = /^[a-zA-Z0-9]+_version-\d{2}\.\d{2}\.\d{4}$/u

  return versionRegex.test(version)
}
