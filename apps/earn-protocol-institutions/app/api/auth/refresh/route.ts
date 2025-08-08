import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createSession, readSession } from '@/app/server-handlers/auth/session'
import { getEnrichedUser } from '@/app/server-handlers/auth/user'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/cookies'
import { AuthService } from '@/features/auth/AuthService'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

  if (!refreshToken) {
    return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 })
  }

  try {
    const { accessToken, idToken } = await AuthService.refreshToken(refreshToken)

    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    })

    const existing = await readSession()

    if (idToken) {
      const payload = decodeJwt(idToken)
      const enriched = await getEnrichedUser({
        sub: payload.sub as string,
        email: payload.email as string,
        name: (payload.name as string | undefined) ?? (payload.email as string),
      })

      await createSession(enriched, payload.sub as string)
    } else if (existing) {
      await createSession(existing.user, existing.sub)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 })
  }
}
