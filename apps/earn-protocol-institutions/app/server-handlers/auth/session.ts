import { createHmac } from 'crypto'
import dayjs from 'dayjs'
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

import { SESSION_COOKIE } from '@/constants/cookies'
import { type SessionPayload, type SignInResponse } from '@/features/auth/types'

const encoder = new TextEncoder()

// bump to invalidate all sessions after a breaking change
const SESSION_AUD = 'institutions'
const SESSION_VERSION = '1'

/**
 * Create a cognito session for a user
 * @param user - The user
 * @param sub - The subject
 * @param cognitoUsername - The cognito username
 * @param ttlSeconds - The time to live in seconds
 */
export const createSession = async (
  user: SignInResponse['user'],
  sub: string,
  cognitoUsername: string,
  ttlSeconds = 15 * 60,
) => {
  const secret = process.env.INSTITUTIONS_SESSION_SECRET

  if (!secret) {
    throw new Error('INSTITUTIONS_SESSION_SECRET must be set')
  }

  const exp = dayjs().unix() + ttlSeconds
  const [token, cookieStore] = await Promise.all([
    await new SignJWT({ user, sub, cognitoUsername, ver: SESSION_VERSION })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt() // helps verification and debugging
      .setAudience(SESSION_AUD)
      .setExpirationTime(exp)
      .sign(encoder.encode(secret)),
    cookies(),
  ])

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ttlSeconds,
  })
}

/**
 * Read a cognito session for a user
 * @returns The session payload
 */
export const readSession = async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  const secret = process.env.INSTITUTIONS_SESSION_SECRET

  if (!secret) {
    throw new Error('INSTITUTIONS_SESSION_SECRET must be set')
  }

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), { audience: SESSION_AUD })

    return {
      user: payload.user as SignInResponse['user'],
      sub: payload.sub as string,
      cognitoUsername: payload.cognitoUsername as string,
      exp: payload.exp as number,
    }
  } catch {
    return null
  }
}

/**
 * Destroy a cognito session for a user
 */
export const destroySession = async () => {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' })
}

/**
 * Generate a secret hash for a message
 * @param message - The message
 * @returns The secret hash
 */
export const generateSecretHash = (message: string): string => {
  const clientId = process.env.INSTITUTIONS_COGNITO_CLIENT_ID as string
  const clientSecret = process.env.INSTITUTIONS_COGNITO_CLIENT_SECRET as string

  return createHmac('sha256', clientSecret)
    .update(message + clientId)
    .digest('base64')
}
