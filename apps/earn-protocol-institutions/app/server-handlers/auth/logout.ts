'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SESSION_COOKIE } from '@/constants/cookies'

export async function logout() {
  const jar = await cookies()

  const known = [
    SESSION_COOKIE,
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    'institutions_session',
    'INSTITUTIONS_SESSION',
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.csrf-token',
    '__Host-next-auth.csrf-token',
  ]

  for (const cookieName of known) {
    if (jar.get(cookieName)) jar.delete(cookieName)
  }

  for (const c of jar.getAll()) {
    if (c.name.startsWith('institutions_')) jar.delete(c.name)
  }

  redirect('/')
}
