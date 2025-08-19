import { type JwtClaims } from '@/features/auth/types'

export function getNameFromPayload(payload: JwtClaims): string {
  const { given_name: given, family_name: family } = payload

  if (given && family) {
    return `${given} ${family}`
  }

  return (
    payload.name ??
    payload.preferred_username ??
    payload['cognito:username'] ?? // its this one, but leaving the rest as a fallback
    payload.email ??
    ''
  )
}
