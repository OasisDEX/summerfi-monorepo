import { type UserRole } from '@summerfi/summer-protocol-institutions-db'

export interface AuthUser {
  id: string
  email: string
  name?: string
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

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
}

export type SignInResponse = {
  user?: SignInUserResponse | SignInGlobalAdminResponse
  challenge?: string
  session?: string
  email?: string
  error?: string
}
