import {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  type InitiateAuthCommandOutput,
  RespondToAuthChallengeCommand,
  type RespondToAuthChallengeCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'
import { decodeJwt } from 'jose'

import type { AuthUser, LoginCredentials } from '@/types/auth'

const client = new CognitoIdentityProviderClient({
  region: 'eu-central-1',
})

export class AuthService {
  static async signIn(
    credentials: LoginCredentials,
    secretHash?: string,
  ): Promise<AuthUser | { challenge: string; session: string }> {
    const authParameters: { [key: string]: string } = {
      USERNAME: credentials.email,
      PASSWORD: credentials.password,
    }

    if (secretHash) {
      authParameters.SECRET_HASH = secretHash
    }

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.INSTITUTIONS_COGNITO_CLIENT_ID,
      AuthParameters: authParameters,
    })

    const response: InitiateAuthCommandOutput = await client.send(command)

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

    const payload = decodeJwt(IdToken)

    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    }
  }

  static async setNewPassword(
    email: string,
    newPassword: string,
    session: string,
    secretHash?: string,
  ): Promise<AuthUser> {
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

    const response: RespondToAuthChallengeCommandOutput = await client.send(command)

    if (!response.AuthenticationResult) {
      throw new Error('Password change failed')
    }

    const { AccessToken, RefreshToken, IdToken } = response.AuthenticationResult

    if (!AccessToken || !RefreshToken || !IdToken) {
      throw new Error('Missing tokens in response')
    }

    const payload = decodeJwt(IdToken)

    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    }
  }

  static async refreshToken(
    refreshToken: string,
    secretHash?: string,
  ): Promise<{ accessToken: string; idToken?: string }> {
    const authParameters: { [key: string]: string } = { REFRESH_TOKEN: refreshToken }

    if (secretHash) {
      authParameters.SECRET_HASH = secretHash
    }

    const command = new InitiateAuthCommand({
      ClientId: process.env.INSTITUTIONS_COGNITO_CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: authParameters,
    })

    const response: InitiateAuthCommandOutput = await client.send(command)
    const { AccessToken, IdToken } = response.AuthenticationResult ?? {}

    if (!AccessToken) {
      throw new Error('Token refresh failed')
    }

    return { accessToken: AccessToken, idToken: IdToken }
  }

  static async signOut(accessToken: string): Promise<void> {
    const command = new GlobalSignOutCommand({
      AccessToken: accessToken,
    })

    await client.send(command)
  }
}
