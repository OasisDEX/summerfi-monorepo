import { Button, Text } from '@summerfi/app-earn-ui'
import { cookies } from 'next/headers'

import {
  REFERRAL_HANDLERS_COOKIE_EXPIRATION_DAYS,
  REFERRAL_HANDLERS_COOKIE_NAME,
  REFERRAL_HANDLERS_COOKIE_PATH,
} from '@/app/secure/constants'

export default async function ReferralHandlersPage() {
  const cookieData = await cookies()
  const isAuthenticated =
    cookieData.has(REFERRAL_HANDLERS_COOKIE_NAME) &&
    cookieData.get(REFERRAL_HANDLERS_COOKIE_NAME)?.value ===
      process.env.REFERRAL_HANDLERS_COOKIE_AUTH_TOKEN

  async function authenticate(formData: FormData) {
    'use server'

    const nextCookieData = await cookies()
    const authToken = formData.get('authToken')

    if (
      typeof authToken === 'string' &&
      authToken === process.env.REFERRAL_HANDLERS_COOKIE_AUTH_TOKEN
    ) {
      nextCookieData.set({
        name: REFERRAL_HANDLERS_COOKIE_NAME,
        value: authToken,
        maxAge: 60 * 60 * 24 * REFERRAL_HANDLERS_COOKIE_EXPIRATION_DAYS, // 30 days
        path: REFERRAL_HANDLERS_COOKIE_PATH,
      })
    } else {
      throw new Error('Invalid authentication token')
    }
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '30vh',
          textAlign: 'center',
        }}
      >
        <Text variant="h1">Referral Handlers</Text>
        <Text variant="p1semi">You are not authorized to view this page</Text>
        <form
          action={authenticate}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '500px',
            margin: '70px auto 10px auto',
          }}
        >
          <input
            type="text"
            id="authToken"
            name="authToken"
            required
            placeholder="Enter your authentication token"
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
          <Button type="submit" variant="primarySmall">
            Authenticate
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h1>Referral Handlers</h1>
      <p>This page is under construction.</p>
    </div>
  )
}
