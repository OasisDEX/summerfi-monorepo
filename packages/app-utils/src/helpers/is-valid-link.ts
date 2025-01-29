/**
 * Validates if a given string is a properly formatted HTTP/HTTPS URL.
 *
 * This function performs several checks:
 * 1. Input validation
 * 2. URL structure validation using the URL constructor
 * 3. Protocol validation (http/https only)
 * 4. Hostname validation including TLD checks
 *
 * @param link - The string to validate as a URL
 * @returns boolean - True if the link is valid, false otherwise
 *
 * @example
 * isValidLink('https://example.com') // returns true
 * isValidLink('ftp://example.com') // returns false
 * isValidLink('https://example..com') // returns false
 */
export function isValidLink(link: string): boolean {
  if (!link || typeof link !== 'string') return false

  try {
    const url = new URL(link)

    // Check for valid protocol
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false

    // Validate hostname structure:
    // - Must exist
    // - Must include at least one dot (for TLD)
    // - Must not have consecutive dots
    if (!url.hostname || !url.hostname.includes('.') || url.hostname.includes('..')) return false

    // Check for empty hostname parts
    if (url.hostname.startsWith('.') || url.hostname.endsWith('.')) return false

    return true
  } catch {
    // URL constructor throws if the string is not a valid URL
    return false
  }
}
