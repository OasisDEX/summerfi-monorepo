import { Button, Icon, Text } from '@summerfi/app-earn-ui'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { revalidateTag, unstable_cache as unstableCache } from 'next/cache'
import { cookies } from 'next/headers'

import {
  SECURE_PAGE_CACHE_TAG,
  SECURE_PAGE_COOKIE_EXPIRATION_DAYS,
  SECURE_PAGE_COOKIE_NAME,
  SECURE_PAGE_COOKIE_PATH,
} from '@/app/secure/constants'
import { GameLeaderboard } from '@/app/secure/game-leaderboard/GameLeaderboard'

const getGameLeaderboard = async () => {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    throw new Error('Summer Protocol DB Connection string is not set')
  }

  let summerProtocolDb: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    summerProtocolDb = await getSummerProtocolDB({
      connectionString,
    })

    const leaderboard = await summerProtocolDb.db
      .selectFrom('yieldRaceLeaderboard')
      .selectAll()
      .orderBy('score', 'desc')
      .execute()

    const allGamesPlayed = await summerProtocolDb.db
      .selectFrom('yieldRaceGames')
      .selectAll()
      .orderBy('timestampStart', 'desc')
      .execute()

    if (!Array.isArray(leaderboard) || leaderboard.length === 0) {
      return {
        gameLeaderboard: [],
        allGamesPlayed: allGamesPlayed.map((game) => ({
          ...game,
          ens: '',
          isBanned: false,
          signedMessage: '',
          gamesPlayed: 0,
        })),
      }
    }

    // select games from the leaderboard wallets
    const leaderboardGamesPlayed = await summerProtocolDb.db
      .selectFrom('yieldRaceGames')
      .selectAll()
      .where(
        'userAddress',
        'in',
        leaderboard.map((l) => l.userAddress),
      )
      .select(['userAddress', 'gamesPlayed'])
      .execute()

    if (!Array.isArray(leaderboard) || leaderboard.length === 0) {
      return {
        gameLeaderboard: [],
        allGamesPlayed: allGamesPlayed.map((game) => ({
          ...game,
          ens: '',
          isBanned: false,
          signedMessage: '',
          gamesPlayed: 0,
        })),
      }
    }

    const gamesLeaderboard = leaderboard.map((entry) => {
      const gameEntry = leaderboardGamesPlayed.find((g) => g.userAddress === entry.userAddress)

      return {
        ...entry,
        gamesPlayed: gameEntry ? gameEntry.gamesPlayed : 0,
      }
    })

    return {
      gameLeaderboard: gamesLeaderboard,
      allGamesPlayed: allGamesPlayed.map((game) => ({
        ...game,
        ens: '',
        isBanned: false,
        signedMessage: '',
        gamesPlayed: 0,
      })),
    }
  } finally {
    await summerProtocolDb?.db.destroy()
  }
}

const getGameLeaderboardCached = unstableCache(getGameLeaderboard, [], {
  tags: [SECURE_PAGE_CACHE_TAG],
  revalidate: 60 * 60, // 1 hour
})

export default async function GameLeaderboardPage() {
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

  async function banUnbanUser(formData: FormData) {
    'use server'
    const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING
    const currentCookieData = await cookies()
    const isCurrentlyAuthenticated =
      currentCookieData.has(SECURE_PAGE_COOKIE_NAME) &&
      currentCookieData.get(SECURE_PAGE_COOKIE_NAME)?.value ===
        process.env.SECURE_PAGE_COOKIE_AUTH_TOKEN

    if (!connectionString) {
      throw new Error('Summer Protocol DB Connection string is not set')
    }
    if (!isCurrentlyAuthenticated) {
      throw new Error('You are not authenticated to perform this action')
    }
    // ban or unban user by address
    const isBanning = formData.get('isBanning') === 'true'
    const userAddress = formData.get('userAddress')

    if (typeof userAddress !== 'string') {
      throw new Error('Invalid user address')
    }
    let summerProtocolDb: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

    try {
      summerProtocolDb = await getSummerProtocolDB({
        connectionString,
      })
      await summerProtocolDb.db
        .updateTable('yieldRaceLeaderboard')
        .set({ isBanned: isBanning })
        .where('userAddress', '=', userAddress)
        .execute()
      revalidateTag(SECURE_PAGE_CACHE_TAG)
    } catch (error) {
      // eslint-disable-next-line no-console
      throw new Error('Error connecting to the database')
    } finally {
      // Always clean up the database connection
      if (summerProtocolDb) {
        await summerProtocolDb.db.destroy().catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error closing database connection (game panel):', err)
        })
      }
    }
  }

  async function deleteScore(formData: FormData) {
    'use server'
    const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING
    const currentCookieData = await cookies()
    const isCurrentlyAuthenticated =
      currentCookieData.has(SECURE_PAGE_COOKIE_NAME) &&
      currentCookieData.get(SECURE_PAGE_COOKIE_NAME)?.value ===
        process.env.SECURE_PAGE_COOKIE_AUTH_TOKEN

    if (!connectionString) {
      throw new Error('Summer Protocol DB Connection string is not set')
    }
    if (!isCurrentlyAuthenticated) {
      throw new Error('You are not authenticated to perform this action')
    }
    const userAddress = formData.get('userAddress')

    if (typeof userAddress !== 'string') {
      throw new Error('Invalid user address')
    }
    let summerProtocolDb: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

    try {
      summerProtocolDb = await getSummerProtocolDB({
        connectionString,
      })
      await summerProtocolDb.db
        .deleteFrom('yieldRaceLeaderboard')
        .where('userAddress', '=', userAddress)
        .execute()
      revalidateTag(SECURE_PAGE_CACHE_TAG)
    } catch (error) {
      // eslint-disable-next-line no-console
      throw new Error('Error connecting to the database')
    } finally {
      // Always clean up the database connection
      if (summerProtocolDb) {
        await summerProtocolDb.db.destroy().catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error closing database connection (game panel):', err)
        })
      }
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
        <Text variant="h1">Game leaderboard</Text>
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

  const { gameLeaderboard, allGamesPlayed } = await getGameLeaderboardCached()

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
        gap: '40px',
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
        Game leaderboard
        <div onClick={refreshView} style={{ cursor: 'pointer', marginLeft: '8px' }}>
          <Icon iconName="refresh" size={24} />
        </div>
      </Text>

      <div style={{ width: '100%' }}>
        <Text variant="h2" style={{ marginBottom: '20px' }}>
          Leaderboard
        </Text>
        <GameLeaderboard
          gameLeaderboard={gameLeaderboard}
          banUnbanUser={banUnbanUser}
          deleteScore={deleteScore}
        />
      </div>

      <div style={{ width: '100%' }}>
        <Text variant="h2" style={{ marginBottom: '20px' }}>
          All Games Played
        </Text>
        <GameLeaderboard
          gameLeaderboard={allGamesPlayed}
          banUnbanUser={banUnbanUser}
          deleteScore={deleteScore}
        />
      </div>
    </div>
  )
}
