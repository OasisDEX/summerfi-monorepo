export interface AuthUser {
  id: string
  email: string
  name?: string
  accessToken: string
  refreshToken: string
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

export interface LoginCredentials {
  email: string
  password: string
}