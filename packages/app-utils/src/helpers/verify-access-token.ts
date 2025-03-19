import { type JwtPayload } from '@summerfi/app-types'
import { jwtVerify } from 'jose'

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
export async function verifyAccessToken({
  token,
  jwtSecret,
}: {
  token: string
  jwtSecret: string
}): Promise<JwtPayload | null> {
  try {
    const jwtChallengeSecretEncoded = new TextEncoder().encode(jwtSecret)

    return (
      await jwtVerify(token, jwtChallengeSecretEncoded, {
        algorithms: ['HS512'],
      })
    ).payload.payload as JwtPayload
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to verify access token', error)

    return null
  }
}
