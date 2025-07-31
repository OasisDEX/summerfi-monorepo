export const LOGIN_COOKIE_SIGNATURE_NAME = 'institutions_login_cookie'
export const LOGIN_COOKIE_WALLET_NAME = 'institutions_login_cookie'
export const LOGIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 14 // 14 days
export const LOGIN_COOKIE_PATH = '/' // Path for the cookie
export const LOGIN_COOKIE_SAME_SITE = 'lax' as const // SameSite policy
export const LOGIN_COOKIE_HTTP_ONLY = true // HTTP only for security
export const LOGIN_COOKIE_SECURE = process.env.NODE_ENV === 'production' // Secure flag for
