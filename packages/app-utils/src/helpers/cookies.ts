/**
 * Sets a cookie with the specified name, value, and expiration days.
 *
 * @param {string} cookieName - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} days - The number of days until the cookie expires.
 * @param {Object} [options] - Optional settings for the cookie.
 * @param {string} [options.path] - The path where the cookie is accessible.
 * @param {boolean} [options.secure] - Whether the cookie is only sent over HTTPS.
 * @param {'Strict' | 'Lax' | 'None'} [options.sameSite] - The SameSite attribute of the cookie.
 */
export const setCookie = (
  cookieName: string,
  value: string,
  days: number,
  options?: {
    path?: string
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
  },
): void => {
  if (typeof window === 'undefined') return // early return for non-browser environments

  if (!cookieName || !value || days < 0) {
    throw new Error('Invalid cookie parameters')
  }

  const date = new Date()

  // eslint-disable-next-line no-mixed-operators
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000) // Calculate expiry date
  const expires = `expires=${date.toUTCString()}`
  const path = options?.path ? `path=${options.path}` : 'path=/'
  const secure = options?.secure ? 'Secure;' : ''
  const sameSite = options?.sameSite ? `SameSite=${options.sameSite};` : ''

  document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(value)}; ${expires}; ${path}; ${secure} ${sameSite}`
}

/**
 * Retrieves the value of a cookie with the specified name.
 *
 * @param {string} cookieName - The name of the cookie to retrieve.
 * @returns {string | null} - The value of the cookie, or null if not found.
 */
export const getCookie = (cookieName: string): string | null => {
  if (typeof window === 'undefined') return null // early return for non-browser environments

  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=')

    if (key === encodeURIComponent(cookieName)) {
      return decodeURIComponent(value)
    }
  }

  return null
}
