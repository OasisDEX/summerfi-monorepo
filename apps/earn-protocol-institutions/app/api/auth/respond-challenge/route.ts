import {
  RespondToAuthChallengeCommand,
  type RespondToAuthChallengeCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'
import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { createSession, generateSecretHash } from '@/app/server-handlers/auth/session'
import { getEnrichedUser } from '@/app/server-handlers/auth/user'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/cookies'
import { cognitoClient } from '@/features/auth/constants'
import { getNameFromPayload } from '@/features/auth/helpers'
import { type BasicAuthResponse, type JwtClaims } from '@/features/auth/types'

const serverRespondToSoftwareToken = async (
  email: string,
  session: string,
  code: string,
  secretHash?: string,
): Promise<BasicAuthResponse> => {
  const challengeResponses: { [key: string]: string } = {
    USERNAME: email,
    SOFTWARE_TOKEN_MFA_CODE: code,
  }

  if (secretHash) {
    challengeResponses.SECRET_HASH = secretHash
  }

  const command = new RespondToAuthChallengeCommand({
    ClientId: process.env.INSTITUTIONS_COGNITO_CLIENT_ID,
    ChallengeName: 'SOFTWARE_TOKEN_MFA',
    Session: session,
    ChallengeResponses: challengeResponses,
  })

  const response: RespondToAuthChallengeCommandOutput = await cognitoClient.send(command)

  if (!response.AuthenticationResult) {
    throw new Error('MFA challenge response failed')
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
    const { email, session, code } = body

    if (!email || !session || !code) {
      return NextResponse.json({ error: 'Email, session and code are required' }, { status: 400 })
    }

    const lowercasedEmail = String(email).toLowerCase()
    const secretHash = generateSecretHash(lowercasedEmail)

    const user = await serverRespondToSoftwareToken(lowercasedEmail, session, code, secretHash)

    if ('id' in user && user.accessToken && user.refreshToken && user.cognitoUsername) {
      const [enriched, cookieStore] = await Promise.all([
        getEnrichedUser({ sub: user.id, email: lowercasedEmail, name: user.name }),
        cookies(),
      ])

      await createSession(enriched, user.id, user.cognitoUsername)

      cookieStore.set(ACCESS_TOKEN_COOKIE, user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60,
      })

      cookieStore.set(REFRESH_TOKEN_COOKIE, user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })

      return NextResponse.json({ user: enriched })
    }

    return NextResponse.json({ error: 'MFA response failed' }, { status: 401 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Respond challenge error:', error)

    return NextResponse.json({ error: 'MFA response failed' }, { status: 400 })
  }
}
