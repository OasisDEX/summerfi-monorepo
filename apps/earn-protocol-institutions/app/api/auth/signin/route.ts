import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { AuthService } from '@/features/auth/AuthService'

if (
  !process.env.INSTITUTIONS_COGNITO_CLIENT_ID ||
  !process.env.INSTITUTIONS_COGNITO_CLIENT_SECRET
) {
  throw new Error('Cognito client ID and secret must be set in environment variables')
}

function generateSecretHash(username: string): string {
  const clientId = process.env.INSTITUTIONS_COGNITO_CLIENT_ID as string
  const clientSecret = process.env.INSTITUTIONS_COGNITO_CLIENT_SECRET as string

  const message = username + clientId

  return createHmac('sha256', clientSecret).update(message).digest('base64')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const secretHash = generateSecretHash(email)
    const result = await AuthService.signIn({ email, password }, secretHash)

    // Check if it's a challenge response
    if ('challenge' in result) {
      return NextResponse.json({
        challenge: result.challenge,
        session: result.session,
        email,
      })
    }

    // Normal authentication success
    const cookieStore = await cookies()

    cookieStore.set('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    })

    cookieStore.set('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    cookieStore.set('username', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return NextResponse.json({
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Sign in error:', error)

    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
