import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { createSession, generateSecretHash } from '@/app/server-handlers/auth/session'
import { getEnrichedUser } from '@/app/server-handlers/auth/user'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/cookies'
import { AuthService } from '@/features/auth/AuthService'
import { type SignInResponse } from '@/types/auth'

if (
  !process.env.INSTITUTIONS_COGNITO_CLIENT_ID ||
  !process.env.INSTITUTIONS_COGNITO_CLIENT_SECRET
) {
  throw new Error('Cognito client ID and secret must be set in environment variables')
}

if (!process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING) {
  throw new Error(
    'EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING must be set in environment variables',
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const secretHash = generateSecretHash(email)

    console.time('AuthService.signIn')
    const result = await AuthService.signIn({ email, password }, secretHash)

    console.timeEnd('AuthService.signIn')

    if ('challenge' in result) {
      return NextResponse.json({ challenge: result.challenge, session: result.session, email })
    }

    console.time('getEnrichedUser')

    const enriched = await getEnrichedUser({
      sub: result.id,
      email: result.email,
      name: result.name ?? result.email,
    })

    console.timeEnd('getEnrichedUser')

    const cookieStore = await cookies()

    cookieStore.set(ACCESS_TOKEN_COOKIE, result.accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    })
    cookieStore.set(REFRESH_TOKEN_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    console.time('createSession')

    await createSession(enriched, result.id)

    console.timeEnd('createSession')

    return NextResponse.json({ user: enriched } as SignInResponse)
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed', details: (error as Error).message },
      { status: 401 },
    )
  }
}
