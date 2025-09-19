import { type UserRole } from '@summerfi/summer-protocol-institutions-db'

export interface LoginCredentials {
  email: string
  password: string
}

export type BasicAuthResponse = {
  id: string
  email: string
  name: string
  cognitoUsername: string
  accessToken?: string
  refreshToken?: string
}

export type ChallengeResponse = {
  challenge?: string
  session?: string
}

export type BasicAuthType = BasicAuthResponse | ChallengeResponse

export type SignInUserResponse = {
  id: string
  email: string
  name: string
  isGlobalAdmin: false
  institutionsList?: {
    id: number
    name: string
    displayName: string
    role: UserRole | null
  }[]
}

export type SignInGlobalAdminResponse = {
  id: string
  email: string
  name: string
  isGlobalAdmin: true
  accessToken?: string
  refreshToken?: string
  institutionsList?: []
}

export type SignInResponse = {
  user?: SignInUserResponse | SignInGlobalAdminResponse
  email?: string
  error?: string
}

export type JwtClaims = {
  sub?: string
  email?: string
  name?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
  'cognito:username'?: string
  [key: string]: unknown
}

export type SessionPayload = {
  user: SignInResponse['user']
  sub: string
  cognitoUsername: string
  exp: number
}
