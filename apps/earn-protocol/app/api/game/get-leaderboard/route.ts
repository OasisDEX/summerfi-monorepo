import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { NextResponse } from 'next/server'

import { type LeaderboardResponse } from '@/features/game/types'

/**
 * This endpoint retrieves the leaderboard for the game.
 */
export async function GET() {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Summer Protocol DB Connection string is not set' },
      { status: 500 },
    )
  }

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })

    const leaderboard = await dbInstance.db
      .selectFrom('yieldRaceLeaderboard')
      .select(['responseTimes', 'score', 'userAddress', 'updatedAt', 'ens'])
      .orderBy('score', 'desc')
      .limit(50)
      .execute()

    const parsedLeaderboard: LeaderboardResponse = leaderboard.map((entry) => {
      const { responseTimes, score, userAddress, updatedAt, ens } = entry
      const parsedResponseTimes = Array.isArray(responseTimes)
        ? responseTimes.map((time) => Number(time))
        : []
      const responseTimesMedian =
        parsedResponseTimes.reduce((a, b) => a + b, 0) / parsedResponseTimes.length

      const response = {
        score: Number(score),
        userAddress,
        ens,
        updatedAt,
        avgResponseTime: Number.isNaN(responseTimesMedian) ? 0 : responseTimesMedian,
      }

      return response
    })

    return NextResponse.json(parsedLeaderboard)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving the leaderboard:', error)

    return NextResponse.json({ error: 'Error retrieving the leaderboard' }, { status: 500 })
  } finally {
    // Always clean up the database connection
    if (dbInstance) {
      await dbInstance.db.destroy().catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error closing database connection (leaderboard):', err)
      })
    }
  }
}
