import {
  RespondToAuthChallengeCommand,
  type RespondToAuthChallengeCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'
import { createHmac } from 'crypto'
import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/cookies'
import { cognitoClient } from '@/features/auth/constants'
import { getNameFromPayload } from '@/features/auth/helpers'
import { type BasicAuthResponse, type JwtClaims } from '@/features/auth/types'

/**
 * Generate a secret hash for the Cognito client
 * @param username - The username of the user
 * @returns The secret hash
 */
const generateSecretHash = (username: string): string => {
  const clientId = process.env.INSTITUTIONS_COGNITO_CLIENT_ID
  const clientSecret = process.env.INSTITUTIONS_COGNITO_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Cognito client ID and secret must be set in environment variables')
  }

  const message = username + clientId

  return createHmac('sha256', clientSecret).update(message).digest('base64')
}

/**
 * Set a new password for a user
 * @param email - The email of the user
 * @param newPassword - The new password
 * @param session - The session
 * @param secretHash - The secret hash
 * @returns The basic auth response
 */
const serverSetNewPassword = async (
  email: string,
  newPassword: string,
  session: string,
  secretHash?: string,
): Promise<BasicAuthResponse> => {
  const challengeResponses: { [key: string]: string } = {
    USERNAME: email,
    NEW_PASSWORD: newPassword,
  }

  if (secretHash) {
    challengeResponses.SECRET_HASH = secretHash
  }

  const command = new RespondToAuthChallengeCommand({
    ClientId: process.env.INSTITUTIONS_COGNITO_CLIENT_ID,
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    Session: session,
    ChallengeResponses: challengeResponses,
  })

  const response: RespondToAuthChallengeCommandOutput = await cognitoClient.send(command)

  if (!response.AuthenticationResult) {
    throw new Error('Password change failed')
  }

  const { AccessToken, RefreshToken, IdToken } = response.AuthenticationResult

  if (!AccessToken || !RefreshToken || !IdToken) {
    throw new Error('Missing tokens in response')
  }

  const payload = decodeJwt(IdToken) as JwtClaims

  const payloadSub = payload.sub
  const payloadEmail = payload.email
  const payloadCognitoUsername = payload['cognito:username']

  if (!payloadSub || !payloadEmail || !payloadCognitoUsername) {
    throw new Error('Invalid ID token')
  }

  return {
    id: payloadSub,
    email: payloadEmail,
    cognitoUsername: payloadCognitoUsername,
    name: getNameFromPayload(payload),
    accessToken: AccessToken,
    refreshToken: RefreshToken,
  }
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
    const user = await serverSetNewPassword(email, newPassword, session, secretHash)

    if ('id' in user && user.accessToken && user.refreshToken) {
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
    } else {
      return NextResponse.json({ error: 'Password change failed' }, { status: 400 })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Set password error:', error)

    return NextResponse.json({ error: 'Password change failed' }, { status: 400 })
  }
}
