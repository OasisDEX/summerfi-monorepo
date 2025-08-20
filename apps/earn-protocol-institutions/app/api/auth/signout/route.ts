import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { destroySession } from '@/app/server-handlers/auth/session'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/cookies'
import { AuthService } from '@/features/auth/AuthService'

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (accessToken) {
    try {
      await AuthService.signOut(accessToken)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Sign out error:', error)
    }
  }
  await destroySession()
  cookieStore.set(ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 })
  cookieStore.set(REFRESH_TOKEN_COOKIE, '', { path: '/', maxAge: 0 })

  return NextResponse.json({ ok: true })
}
