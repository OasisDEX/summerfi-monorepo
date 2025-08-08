import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/cookies'
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
    const { email, newPassword, session } = body

    if (!email || !newPassword || !session) {
      return NextResponse.json(
        { error: 'Email, new password, and session are required' },
        { status: 400 },
      )
    }

    const secretHash = generateSecretHash(email)
    const user = await AuthService.setNewPassword(email, newPassword, session, secretHash)

    // Set secure HTTP-only cookies
    const cookieStore = await cookies()

    cookieStore.set(ACCESS_TOKEN_COOKIE, user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    })

    cookieStore.set(REFRESH_TOKEN_COOKIE, user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Set password error:', error)

    return NextResponse.json({ error: 'Password change failed' }, { status: 400 })
  }
}
