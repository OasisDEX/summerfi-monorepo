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
  unhashGameData,
} from '@/features/game/helpers/gameHelpers'

const pathParamsSchema = z.object({
  walletAddress: addressSchema,
})

const postBodyParamsSchema = z.object({
  score: z.number().min(0),
  gameData: z.string(),
  gameId: z.string().length(64),
})

/*
 * This endpoint ends an active game for the user.
 * It checks if the user has an active game and updates it with the end timestamp.
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
  const { score, gameData, gameId } = validatedPostBody

  const parsedGameData = unhashGameData(gameData, gameId)

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })
    // Check if the game exists
    const game = await dbInstance.db
      .selectFrom('yieldRaceGames')
      .where('userAddress', '=', walletAddress.toLowerCase())
      .orderBy('timestampStart', 'desc')
      .select(['gameId', 'timestampStart'])
      .limit(1)
      .executeTakeFirst()

    if (!game) {
      return NextResponse.json({ error: 'No active game found for this user' }, { status: 404 })
    }

    const castedResponseTimes = parsedGameData as number[]

    if (!Array.isArray(castedResponseTimes)) {
      return NextResponse.json({ errorCode: '005' }, { status: 400 })
    }

    // check if the median response times are humanly possible
    const medianResponseTimeCheck = medianScoreMakesSenseCheck(castedResponseTimes)

    if (!medianResponseTimeCheck) {
      return NextResponse.json({ errorCode: '005' }, { status: 400 })
    }

    const backendScore = calculateFinalScore(castedResponseTimes)

    if (scoreMakesSenseCheck({ score, backendScore })) {
      return NextResponse.json({ errorCode: '006' }, { status: 400 })
    }

    // check if response times vs round times make sense
    const roundsMakeSense = roundsMakeSenseCheck(castedResponseTimes)

    if (!roundsMakeSense) {
      return NextResponse.json({ errorCode: '007' }, { status: 400 })
    }

    // Update the game with the end timestamp
    const timestampEnd = dayjs().unix()

    await dbInstance.db
      .updateTable('yieldRaceGames')
      .set({
        timestampEnd,
        updatedAt: timestampEnd,
        gameId,
        responseTimes:
          typeof parsedGameData === 'string' ? parsedGameData : JSON.stringify(parsedGameData),
        score,
        userAddress: walletAddress.toLowerCase(),
      })
      .where('gameId', '=', game.gameId)
      .execute()

    return NextResponse.json({
      gameId: game.gameId,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error finishing a game:', error)

    return NextResponse.json({ error: 'Error finishing a game' }, { status: 500 })
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
