import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ResponseBadRequest, ResponseOk } from '@summerfi/serverless-shared/responses'
import { Logger } from '@aws-lambda-powertools/logger'
import { getRaysDB } from '@summerfi/rays-db'
import { numberSchema } from '@summerfi/serverless-shared'
import { z } from 'zod'
import { sql } from 'kysely'

const logger = new Logger({ serviceName: 'get-rays-function' })

export const queryParamsSchema = z.object({
  page: numberSchema.optional().default(1),
  limit: numberSchema.optional().default(10),
  userAddress: z.string().optional().default(''),
  sortMethod: z
    .union([
      z.literal('top_gainers'), // deprecated, use top_gainers_rank
      z.literal('top_gainers_rank'),
      z.literal('top_gainers_points'),
      z.literal('top_gainers_rank_1000'),
      z.literal('top_gainers_rank_100'),
      z.literal(''),
    ])
    .optional()
    .default(''),
})

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const { RAYS_DB_CONNECTION_STRING } = process.env
  if (!RAYS_DB_CONNECTION_STRING) {
    throw new Error('RAYS_DB_CONNECTION_STRING is not set')
  }
  console.log(RAYS_DB_CONNECTION_STRING)
  logger.addContext(context)

  const parsedResult = queryParamsSchema.safeParse(event.queryStringParameters || {})
  if (!parsedResult.success) {
    return ResponseBadRequest({ body: { message: parsedResult.error.message } })
  }

  const { page, limit, userAddress, sortMethod } = parsedResult.data
  const offset = (page - 1) * limit

  const dbConfig = {
    connectionString: RAYS_DB_CONNECTION_STRING,
    logger,
  }

  const { db } = await getRaysDB(dbConfig)

  const castedPoints22h = 'points_22h' as 'points22h'
  const castedRank22h = 'rank_22h' as 'rank22h'

  const leaderboard = await db
    .selectFrom('leaderboard_new')
    .selectAll()
    .where((eb) =>
      eb.or(
        {
          top_gainers_rank: [eb('totalPoints', '>', '2000')],
          top_gainers: [eb('totalPoints', '>', '2000')],
          top_gainers_rank_1000: [
            eb.and([eb('rank', '<=', '1000'), eb(castedRank22h, '<=', '1000')]),
          ],
          top_gainers_rank_100: [eb.and([eb('rank', '<=', '100'), eb(castedRank22h, '<=', '100')])],
          top_gainers_points: [
            eb.and([eb(castedPoints22h, 'is not', null), eb(castedPoints22h, '>', '2000')]),
          ],
          default: [
            eb('userAddress', 'like', `%${userAddress}%`),
            eb('ens', 'like', `%${userAddress}%`),
          ],
        }[sortMethod || 'default'],
      ),
    )
    .orderBy(() => {
      return {
        top_gainers: sql`rank_22h - rank DESC`,
        top_gainers_rank: sql`rank_22h - rank DESC`,
        top_gainers_rank_1000: sql`rank_22h - rank DESC`,
        top_gainers_rank_100: sql`rank_22h - rank DESC`,
        top_gainers_points: sql`total_points - points_22h DESC`,
        default: sql`total_points DESC`,
      }[sortMethod || 'default']
    })
    .limit(limit)
    .offset(offset)
    .execute()

  return ResponseOk({
    body: {
      leaderboard,
    },
  })
}

export default handler
