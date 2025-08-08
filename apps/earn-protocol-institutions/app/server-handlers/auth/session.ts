import dayjs from 'dayjs'
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

import { SESSION_COOKIE } from '@/constants/cookies'
import { type SignInGlobalAdminResponse, type SignInUserResponse } from '@/types/auth'

const encoder = new TextEncoder()
const secret = process.env.INSTITUTIONS_SESSION_SECRET

// bump to invalidate all sessions after a breaking change
const SESSION_AUD = 'institutions'
const SESSION_VERSION = '1'

if (!secret) {
  throw new Error('INSTITUTIONS_SESSION_SECRET must be set')
}

export type SessionUser = SignInUserResponse | SignInGlobalAdminResponse

type SessionPayload = {
  user: SessionUser
  sub: string
  exp: number
}

export async function createSession(user: SessionUser, sub: string, ttlSeconds = 15 * 60) {
  const exp = dayjs().unix() + ttlSeconds
  const token = await new SignJWT({ user, sub, ver: SESSION_VERSION })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt() // helps verification and debugging
    .setAudience(SESSION_AUD)
    .setExpirationTime(exp)
    .sign(encoder.encode(secret))

  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ttlSeconds,
  })
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), { audience: SESSION_AUD })

    return {
      user: payload.user as SessionUser,
      sub: payload.sub as string,
      exp: payload.exp as number,
    }
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' })
}
