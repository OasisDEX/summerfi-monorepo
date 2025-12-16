import { Button, Icon, Text } from '@summerfi/app-earn-ui'
import { getBeachClubDb } from '@summerfi/summer-beach-club-db'
import { revalidateTag, unstable_cache as unstableCache } from 'next/cache'
import { cookies } from 'next/headers'

import {
  SECURE_PAGE_CACHE_TAG,
  SECURE_PAGE_COOKIE_EXPIRATION_DAYS,
  SECURE_PAGE_COOKIE_NAME,
  SECURE_PAGE_COOKIE_PATH,
} from '@/app/secure/constants'

import { ReferralTable } from './ReferralTable'

const getReferralsListFunction = async () => {
  const beachClubDbConnectionString = process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING

  if (!beachClubDbConnectionString) {
    throw new Error('Beach Club Rewards DB Connection string is not set')
  }

  let beachClubDbInstance: Awaited<ReturnType<typeof getBeachClubDb>> | undefined

  try {
    beachClubDbInstance = getBeachClubDb({
      connectionString: beachClubDbConnectionString,
    })

    return await beachClubDbInstance.db
      .selectFrom('users')
      .leftJoin('referral_codes', 'referral_codes.id', 'users.referral_code')
      .select([
        'users.id',
        'users.referral_code',
        'referral_codes.custom_code',
        'referral_codes.total_deposits_referred_usd',
        'referral_codes.active_users_count',
      ])
      .where('users.referral_code', 'is not', null)
      .orderBy('referral_codes.total_deposits_referred_usd', 'desc')
      .execute()
  } finally {
    await beachClubDbInstance?.db.destroy()
  }
}

const getReferralsListCached = unstableCache(getReferralsListFunction, ['referralsList'], {
  tags: [SECURE_PAGE_CACHE_TAG],
  revalidate: 60 * 60, // 1 hour
})

export default async function ReferralHandlersPage() {
  const cookieData = await cookies()

  const isAuthenticated =
    cookieData.has(SECURE_PAGE_COOKIE_NAME) &&
    cookieData.get(SECURE_PAGE_COOKIE_NAME)?.value === process.env.SECURE_PAGE_COOKIE_AUTH_TOKEN

  async function authenticate(formData: FormData) {
    'use server'

    const nextCookieData = await cookies()
    const authToken = formData.get('authToken')

    if (typeof authToken === 'string' && authToken === process.env.SECURE_PAGE_COOKIE_AUTH_TOKEN) {
      nextCookieData.set({
        name: SECURE_PAGE_COOKIE_NAME,
        value: authToken,
        maxAge: 60 * 60 * 24 * SECURE_PAGE_COOKIE_EXPIRATION_DAYS, // n days
        path: SECURE_PAGE_COOKIE_PATH,
        secure: true,
        httpOnly: true,
      })
    } else {
      const got = `${authToken?.slice(0, 3)}...${authToken?.slice(-3)}`
      const expected = `${process.env.SECURE_PAGE_COOKIE_AUTH_TOKEN?.slice(0, 3)}...${process.env.SECURE_PAGE_COOKIE_AUTH_TOKEN?.slice(-3)}`

      throw new Error(`Invalid authentication token. Got ${got}, expected ${expected}`)
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
            width: '100%',
            margin: '70px auto 10px auto',
          }}
        >
          <input
            type="text"
            id="authToken"
            name="authToken"
            required
            placeholder="Enter authentication token"
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
          <Button
            type="submit"
            variant="primarySmall"
            style={{ width: 'min-content', margin: '0 auto' }}
          >
            Authenticate
          </Button>
        </form>
      </div>
    )
  }

  const referralsList = await getReferralsListCached()

  const refreshView = async () => {
    'use server'

    revalidateTag(SECURE_PAGE_CACHE_TAG)

    // arbitrary delay
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    return await Promise.resolve()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Text
        variant="h1"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        Referral Handlers
        <div onClick={refreshView} style={{ cursor: 'pointer', marginLeft: '8px' }}>
          <Icon iconName="refresh" size={24} />
        </div>
      </Text>
      <ReferralTable referralsList={referralsList} refreshView={refreshView} />
    </div>
  )
}
