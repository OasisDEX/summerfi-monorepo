import { addressSchema } from '@summerfi/serverless-shared'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import dayjs from 'dayjs'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  calculateFinalScore,
  medianScoreMakesSenseCheck,
  roundsMakeSenseCheck,
  scoreMakesSenseCheck,
} from '@/features/game/helpers/gameHelpers'

const pathParamsSchema = z.object({
  walletAddress: addressSchema,
})

const postBodyParamsSchema = z.object({
  gameId: z.string().length(64),
})

/*
 * This endpoint adds user's current game to the leaderboard.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Summer Protocol DB Connection string is not set' },
      { status: 500 },
    )
  }
  let validatedPathParams
  let validatedPostBody

  try {
    validatedPathParams = pathParamsSchema.parse(await params)
    validatedPostBody = postBodyParamsSchema.parse(await req.json())
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Invalid parameters',
        details: err instanceof z.ZodError ? err.errors : String(err),
      },
      { status: 400 },
    )
  }

  const { walletAddress } = validatedPathParams
  const { gameId } = validatedPostBody

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })
    // Get the current game for the user
    const savedGame = await dbInstance.db
      .selectFrom('yieldRaceGames')
      .where('userAddress', '=', walletAddress.toLowerCase())
      .orderBy('timestampStart', 'desc')
      .select(['gameId', 'timestampStart', 'timestampEnd', 'responseTimes', 'score', 'userAddress'])
      .limit(1)
      .executeTakeFirst()

    /* Error codes
     * 001 - No active game found for this user
     * 002 - Game has already been submitted to the leaderboard
     * 003 - Game ID does not match the current game
     * 004 - Game is not ended yet
     * 005 - Invalid response times for the game
     * 006 - Invalid score for the game
     * 007 - Response time exceeds round time
     */

    if (!savedGame) {
      return NextResponse.json({ errorCode: '001' }, { status: 404 })
    }

    // check if the game was already submitted
    const existingGame = await dbInstance.db
      .selectFrom('yieldRaceLeaderboard')
      .where('gameId', '=', savedGame.gameId)
      .selectAll()
      .executeTakeFirst()

    if (existingGame) {
      return NextResponse.json({ errorCode: '002' }, { status: 400 })
    }

    // check if the gameId matches the current game
    if (savedGame.gameId !== gameId) {
      return NextResponse.json({ errorCode: '003', gameId: savedGame.gameId }, { status: 400 })
    }

    // check if the game is ended
    if (!savedGame.timestampEnd || dayjs(Number(savedGame.timestampEnd) * 1000).isAfter(dayjs())) {
      return NextResponse.json({ errorCode: '004' }, { status: 400 })
    }

    const { responseTimes } = savedGame

    // check if the game.responseTimes is an array
    if (!Array.isArray(savedGame.responseTimes)) {
      return NextResponse.json({ errorCode: '005' }, { status: 400 })
    }

    // check if the score makes sense

    const castedResponseTimes = responseTimes as number[]

    if (!Array.isArray(castedResponseTimes)) {
      return NextResponse.json({ errorCode: '005' }, { status: 400 })
    }

    // check if the median response times are humanly possible
    const medianResponseTimeCheck = medianScoreMakesSenseCheck(castedResponseTimes)

    if (!medianResponseTimeCheck) {
      return NextResponse.json({ errorCode: '005' }, { status: 400 })
    }

    const backendScore = calculateFinalScore(castedResponseTimes)

    if (scoreMakesSenseCheck({ score: savedGame.score, backendScore })) {
      return NextResponse.json({ errorCode: '006' }, { status: 400 })
    }

    // check if response times vs round times make sense
    const roundsMakeSense = roundsMakeSenseCheck(castedResponseTimes)

    if (!roundsMakeSense) {
      return NextResponse.json({ errorCode: '007' }, { status: 400 })
    }

    // Ensure responseTimes is always a valid JSON string
    const responseTimesJson = Array.isArray(savedGame.responseTimes)
      ? JSON.stringify(savedGame.responseTimes)
      : typeof savedGame.responseTimes === 'string'
        ? savedGame.responseTimes
        : JSON.stringify([])

    // Upsert leaderboard entry: update if userAddress exists, otherwise insert
    const upsertQuery = dbInstance.db
      .insertInto('yieldRaceLeaderboard')
      .values({
        gameId: savedGame.gameId,
        userAddress: savedGame.userAddress.toLowerCase(),
        score: savedGame.score,
        signedMessage: '',
        responseTimes: responseTimesJson,
        updatedAt: dayjs().unix(),
      })
      .onConflict((oc) =>
        oc.column('userAddress').doUpdateSet({
          gameId: savedGame.gameId,
          score: savedGame.score,
          signedMessage: '',
          responseTimes: responseTimesJson,
          updatedAt: dayjs().unix(),
        }),
      )

    const savedLeaderboardGame = await upsertQuery.executeTakeFirst()

    if (!savedLeaderboardGame.numInsertedOrUpdatedRows) {
      return NextResponse.json(
        { error: 'Error saving the game to the leaderboard' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      gameId: savedGame.gameId,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error submitting a game to the leaderboard:', error)

    return NextResponse.json(
      { error: 'Error submitting a game to the leaderboard' },
      { status: 500 },
    )
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
