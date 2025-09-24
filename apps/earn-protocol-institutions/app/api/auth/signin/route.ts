import {
  InitiateAuthCommand,
  type InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'
import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { createSession, generateSecretHash } from '@/app/server-handlers/auth/session'
import { getEnrichedUser } from '@/app/server-handlers/auth/user'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/cookies'
import { cognitoClient } from '@/features/auth/constants'
import { getNameFromPayload } from '@/features/auth/helpers'
import {
  type BasicAuthType,
  type LoginCredentials,
  type SignInResponse,
} from '@/features/auth/types'

type JwtClaims = {
  sub?: string
  email?: string
  name?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
  'cognito:username'?: string
  [key: string]: unknown
}

/**
 * Sign in a user
 * @param credentials - The login credentials
 * @param secretHash - The secret hash
 * @returns The basic auth type
 */
const serverSignIn = async (
  credentials: LoginCredentials,
  secretHash?: string,
): Promise<BasicAuthType> => {
  const clientId = process.env.INSTITUTIONS_COGNITO_CLIENT_ID

  if (!clientId) {
    throw new Error('Cognito client ID must be set in environment variables')
  }

  const authParameters: { [key: string]: string } = {
    USERNAME: credentials.email,
    PASSWORD: credentials.password,
  }

  if (secretHash) {
    authParameters.SECRET_HASH = secretHash
  }

  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: authParameters,
  })

  const response: InitiateAuthCommandOutput = await cognitoClient.send(command)

  // Handle challenge (like NEW_PASSWORD_REQUIRED)
  if (response.ChallengeName) {
    if (!response.Session) {
      throw new Error('Session is required for challenge response')
    }

    return {
      challenge: response.ChallengeName,
      session: response.Session,
    }
  }

  if (!response.AuthenticationResult) {
    throw new Error('Authentication failed')
  }

  const { AccessToken, RefreshToken, IdToken } = response.AuthenticationResult

  if (!AccessToken || !RefreshToken || !IdToken) {
    throw new Error('Missing tokens in response')
  }

  const payload = decodeJwt(IdToken) as JwtClaims

  if (!payload.sub || !payload.email || !payload['cognito:username']) {
    throw new Error('Invalid ID token')
  }

  return {
    id: payload.sub,
    email: payload.email,
    cognitoUsername: payload['cognito:username'],
    name: getNameFromPayload(payload),
    accessToken: AccessToken,
    refreshToken: RefreshToken,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const lowercasedEmail = email.toLowerCase()
    const secretHash = generateSecretHash(lowercasedEmail)

    const result = await serverSignIn({ email: lowercasedEmail, password }, secretHash)

    if ('challenge' in result) {
      return NextResponse.json({
        challenge: result.challenge,
        session: result.session,
        email: lowercasedEmail,
      })
    }

    if ('id' in result && result.accessToken && result.refreshToken && result.cognitoUsername) {
      const [enriched, cookieStore] = await Promise.all([
        getEnrichedUser({
          sub: result.id,
          email: lowercasedEmail,
          name: result.name,
        }),
        cookies(),
      ])

      await createSession(enriched, result.id, result.cognitoUsername)

      cookieStore.set(ACCESS_TOKEN_COOKIE, result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
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

      return NextResponse.json({ user: enriched } as SignInResponse)
    } else {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed', details: (error as Error).message },
      { status: 401 },
    )
  }
}
