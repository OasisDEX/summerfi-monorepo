import { GlobalSignOutCommand } from '@aws-sdk/client-cognito-identity-provider'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { destroySession } from '@/app/server-handlers/auth/session'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/cookies'
import { cognitoClient } from '@/features/auth/constants'

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (accessToken) {
    try {
      const command = new GlobalSignOutCommand({
        AccessToken: accessToken,
      })

      await cognitoClient.send(command)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Sign out error:', error)
    }
  }
  await destroySession() // handles SESSION_COOKIE
  cookieStore.set(ACCESS_TOKEN_COOKIE, '', { path: '/', maxAge: 0 })
  cookieStore.set(REFRESH_TOKEN_COOKIE, '', { path: '/', maxAge: 0 })

  return NextResponse.json({ ok: true })
}
