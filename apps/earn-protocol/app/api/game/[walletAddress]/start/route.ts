import { addressSchema } from '@summerfi/serverless-shared'
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
) {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Summer Protocol DB Connection string is not set' },
      { status: 500 },
    )
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

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })
    // Check for db spamming - one game per [GAME_TIMEOUT_SECONDS] seconds
    const lastGame = await dbInstance.db
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

    const timestamp = dayjs().unix()
    const gameId = createHash('sha256')
      .update(`${walletAddress}-${timestamp}-${process.env.GAME_SECRET}`)
      .digest('hex')

    if (lastGame) {
      // Update the existing game with the new start timestamp
      await dbInstance.db
        .updateTable('yieldRaceGames')
        .set({
          gameId,
          timestampStart: timestamp,
          updatedAt: timestamp,
        })
        .where('gameId', '=', lastGame.gameId)
        .execute()

      return NextResponse.json({
        gameId,
      })
    } else {
      // Insert the game into the database
      await dbInstance.db
        .insertInto('yieldRaceGames')
        .values({
          userAddress: walletAddress.toLowerCase(),
          gameId,
          timestampStart: timestamp,
        })
        .execute()

      return NextResponse.json({
        gameId,
      })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating a game:', error)

    return NextResponse.json({ error: 'Error creating a game' }, { status: 500 })
  } finally {
    // Always clean up the database connection
    if (dbInstance) {
      await dbInstance.db.destroy().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error closing database connection (game):', err)
      })
    }
  }
}
