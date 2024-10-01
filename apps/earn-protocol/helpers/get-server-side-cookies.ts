/**
 * Retrieves the value of a specific cookie from a server-side cookie string.
 *
 * This function extracts the value of a specified cookie from the server-side
 * `cookies` string, which contains all cookies. It returns the decoded value of the
 * cookie if found, or an empty string if the cookie is not present.
 *
 * @param cookieName - The name of the cookie to retrieve.
 * @param cookies - The full cookie string from the server, or null if no cookies are present.
 * @returns The value of the specified cookie, or an empty string if not found.
 */
export const getServerSideCookies = (cookieName: string, cookies: string | null): string => {
  const _name = `${cookieName}=`

  if (cookies === null) {
    return ''
  }

  const decodedCookies = decodeURIComponent(cookies) // Decodes the cookie string
  const cookiesArray = decodedCookies.split(';') // Split each cookie into an array

  for (let cookie of cookiesArray) {
    cookie = cookie.trim() // Remove leading/trailing spaces
    if (cookie.startsWith(_name)) {
      return cookie.substring(_name.length, cookie.length) // Return the cookie value
    }
  }

  return ''
}
