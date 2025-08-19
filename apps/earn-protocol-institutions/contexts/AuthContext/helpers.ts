import dayjs from 'dayjs'

import { type SignInResponse } from '@/types/auth'

export const authComputeDelayMs = (exp: number, leadSec = 30) => {
  const nowSec = dayjs().unix()

  return Math.max((exp - nowSec - leadSec) * 1000, 0)
}

export const authFetchMe = async () => {
  const res = await fetch('/api/auth/me', { credentials: 'include' })

  if (!res.ok) {
    throw new Error(`me failed: ${res.status}`)
  }

  return res.json() as Promise<{ user: SignInResponse['user']; exp?: number }>
}

export const authRefresh = async () => {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  return res.ok
}
