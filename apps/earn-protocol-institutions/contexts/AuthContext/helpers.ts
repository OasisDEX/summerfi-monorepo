import dayjs from 'dayjs'

import { type SignInResponse } from '@/features/auth/types'

export const authComputeDelayMs = (exp: number, leadSec = 30) => {
  const nowSec = dayjs().unix()

  return Math.max((exp - nowSec - leadSec) * 1000, 0)
}

export const authFetchMe = async ({ signal }: { signal?: AbortSignal } = {}) => {
  const res = await fetch('/api/auth/me', { credentials: 'include', signal })

  if (!res.ok) {
    const error: Error & { status?: number } = new Error(`me failed: ${res.status}`)

    error.status = res.status

    throw error
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
