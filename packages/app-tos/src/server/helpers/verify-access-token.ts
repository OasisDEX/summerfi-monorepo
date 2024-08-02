import { type JwtPayload } from '@summerfi/app-types'
import jwt from 'jsonwebtoken'

/**
 * Verify the provided access token using the given secret.
 *
 * @param token - The JWT token to verify.
 * @param jwtSecret - The secret key used to verify the token.
 * @returns The decoded JwtPayload if the token is valid, otherwise null.
 *
 * @remarks
 * This function attempts to verify a JWT token using the provided secret. If verification
 * is successful, it returns the decoded payload. If verification fails, it returns null.
 */
export function verifyAccessToken({
  token,
  jwtSecret,
}: {
  token: string
  jwtSecret: string
}): JwtPayload | null {
  try {
    return jwt.verify(token, jwtSecret) as JwtPayload
  } catch (error) {
    return null
  }
}
