/**
 * Sanitizes a referral code by removing unsafe characters and validating its format.
 *
 * The function:
 * - Trims whitespace
 * - Validates length (3-20 characters)
 * - Only allows alphanumeric characters, hyphens, underscores, and dots
 * - Returns null if the code doesn't meet requirements
 *
 * @param code - The raw referral code to sanitize
 * @returns The sanitized referral code or null if invalid
 *
 * @example
 * // Valid codes:
 * sanitizeReferralCode('test.eth')    // returns 'test.eth'
 * sanitizeReferralCode('test-eth')     // returns 'test-eth'
 * sanitizeReferralCode('tes-test.eth') // returns 'tes-test.eth'
 *
 * // Invalid codes:
 * sanitizeReferralCode('ab')            // returns null (too short)
 * sanitizeReferralCode('a@b.com')       // returns 'ab.com' (removes @)
 * sanitizeReferralCode('  test  ')      // returns 'test' (trims whitespace)
 */
export const sanitizeReferralCode = (
  code: string,
  ignoreLength: boolean = false,
): string | null => {
  // Remove any whitespace
  const trimmed = code.trim()

  // Check length (adjust these limits based on your requirements)
  if ((trimmed.length < 3 || trimmed.length > 20) && !ignoreLength) {
    return null
  }

  // Allow alphanumeric characters, hyphens, underscores, and dots
  // This will allow formats like chrisb.eth and test-juan
  const sanitized = trimmed.replace(/[^a-zA-Z0-9\-_.]/gu, '')

  // If after sanitization the code is empty or too short, return null
  if (sanitized.length < 3 && !ignoreLength) {
    return null
  }

  return sanitized
}
