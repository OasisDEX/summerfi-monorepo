import { addressSchema } from '@summerfi/serverless-shared'
import { getBeachClubDb } from '@summerfi/summer-beach-club-db'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { createHash } from 'crypto'
import dayjs from 'dayjs'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
  walletAddress: addressSchema,
})

const GAME_TIMEOUT_SECONDS = 5

/*
 * This endpoint creates a new game for the user.
 * It checks if the user has created a game in the last [GAME_TIMEOUT_SECONDS] seconds.
 * If so, it returns an error.
 * Otherwise, it creates a new game and returns the game ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> },
): Promise<NextResponse> {
  const beachClubDbConnectionString = process.env.BEACH_CLUB_REWARDS_DB_CONNECTION_STRING
  const summerProtocolDbConnectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!beachClubDbConnectionString) {
    throw new Error('Beach Club Rewards DB Connection string is not set')
  }

  if (!summerProtocolDbConnectionString) {
    throw new Error('Summer Protocol DB Connection string is not set')
  }
  let validatedParams

  try {
    validatedParams = paramsSchema.parse(await params)
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Invalid parameters',
        details: err instanceof z.ZodError ? err.errors : String(err),
      },
      { status: 400 },
    )
  }

  const { walletAddress } = validatedParams

  let summerProtocolDb: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined
  let beachClubDb: Awaited<ReturnType<typeof getBeachClubDb>> | undefined

  try {
    summerProtocolDb = await getSummerProtocolDB({
      connectionString: summerProtocolDbConnectionString,
    })

    // Check for db spamming - one game per [GAME_TIMEOUT_SECONDS] seconds
    const lastGame = await summerProtocolDb.db
      .selectFrom('yieldRaceGames')
      .where('userAddress', '=', walletAddress.toLowerCase())
      .orderBy('timestampStart', 'desc')
      .select(['timestampStart', 'gameId'])
      .limit(1)
      .executeTakeFirst()

    if (lastGame) {
      const lastTimestamp = dayjs(Number(lastGame.timestampStart) * 1000) // Convert to seconds
      const currentTimestamp = dayjs()

      if (currentTimestamp.diff(lastTimestamp, 'seconds') < GAME_TIMEOUT_SECONDS) {
        return NextResponse.json(
          { error: `You can only create one game every ${GAME_TIMEOUT_SECONDS} seconds` },
          { status: 429 },
        )
      }
    }

    beachClubDb = getBeachClubDb({
      connectionString: beachClubDbConnectionString,
    })

    // Get the current high score for the user
    // Get the users referral ID
    const [userRefCode, currentLeaderboardEntry] = await Promise.all([
      beachClubDb.db
        .selectFrom('users')
        .select('referral_code')
        .leftJoin('referral_codes', 'referral_codes.id', 'users.referral_code')
        .select(['custom_code'])
        .where('users.id', '=', walletAddress.toLowerCase())
        .executeTakeFirst(),
      await summerProtocolDb.db
        .selectFrom('yieldRaceLeaderboard')
        .where('userAddress', '=', walletAddress.toLowerCase())
        .select(['score', 'isBanned'])
        .orderBy('score', 'desc')
        .limit(1)
        .executeTakeFirst(),
    ])

    const timestamp = dayjs().unix()
    const gameId = createHash('sha256').update(`${walletAddress}-${timestamp}`).digest('hex')

    if (lastGame) {
      // Update the existing game with the new start timestamp
      await summerProtocolDb.db
        .updateTable('yieldRaceGames')
        .set({
          gameId,
          timestampStart: timestamp,
          updatedAt: timestamp,
        })
        .where('gameId', '=', lastGame.gameId)
        .execute()
    } else {
      // Insert the game into the database
      await summerProtocolDb.db
        .insertInto('yieldRaceGames')
        .values({
          userAddress: walletAddress.toLowerCase(),
          gameId,
          timestampStart: timestamp,
        })
        .execute()
    }

    return NextResponse.json({
      gameId,
      ref: userRefCode?.custom_code ?? userRefCode?.custom_code,
      currentHighScore: currentLeaderboardEntry?.score,
      isBanned: currentLeaderboardEntry?.isBanned ?? false,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating a game:', error)

    return NextResponse.json({ error: 'Error creating a game' }, { status: 500 })
  } finally {
    // Always clean up the database connection
    if (summerProtocolDb) {
      await summerProtocolDb.db.destroy().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error closing database connection (game):', err)
      })
    }
    if (beachClubDb) {
      await beachClubDb.db.destroy().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error closing database connection (beach club):', err)
      })
    }
  }
}
