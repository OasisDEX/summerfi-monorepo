import {
  InitiateAuthCommand,
  type InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'
import { decodeJwt } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createSession, generateSecretHash, readSession } from '@/app/server-handlers/auth/session'
import { getEnrichedUser } from '@/app/server-handlers/auth/user'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@/constants/cookies'
import { cognitoClient } from '@/features/auth/constants'

async function serverRefreshToken(
  refreshToken: string,
  username: string,
  secretHash: string,
): Promise<{ accessToken: string; idToken?: string }> {
  if (!process.env.INSTITUTIONS_COGNITO_CLIENT_ID) {
    throw new Error('Missing Cognito Client ID')
  }
  const command = new InitiateAuthCommand({
    ClientId: process.env.INSTITUTIONS_COGNITO_CLIENT_ID,
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
      USERNAME: username,
      SECRET_HASH: secretHash,
    },
  })
  const response: InitiateAuthCommandOutput = await cognitoClient.send(command)
  const { AccessToken, IdToken } = response.AuthenticationResult ?? {}

  if (!AccessToken) {
    throw new Error('Token refresh failed')
  }

  return { accessToken: AccessToken, idToken: IdToken }
}

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value

  if (!refreshToken) {
    return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 })
  }

  try {
    const existing = await readSession()

    if (!existing?.user?.email || !existing.sub || !existing.cognitoUsername) {
      throw new Error('Missing user data')
    }

    // To ensure consistency with the successful sign-in flow, we must use the
    // cognito:username for both the USERNAME and the secret hash calculation.
    const username = existing.cognitoUsername
    const secretHash = generateSecretHash(existing.cognitoUsername)

    const { accessToken, idToken } = await serverRefreshToken(refreshToken, username, secretHash)

    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    })

    if (idToken) {
      const payload = decodeJwt(idToken)
      const enriched = await getEnrichedUser({
        sub: payload.sub as string,
        email: payload.email as string,
        name: (payload.name as string | undefined) ?? (payload.email as string),
      })

      await createSession(enriched, payload.sub as string, existing.cognitoUsername)
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (existing) {
      await createSession(existing.user, existing.sub, existing.cognitoUsername)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Refresh failed', error)

    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 })
  }
}
