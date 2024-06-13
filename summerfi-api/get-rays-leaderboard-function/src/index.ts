import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ResponseBadRequest, ResponseOk } from '@summerfi/serverless-shared/responses'
import { Logger } from '@aws-lambda-powertools/logger'
import { getRaysDB } from '@summerfi/rays-db'
import { numberSchema } from '@summerfi/serverless-shared'
import { z } from 'zod'

const logger = new Logger({ serviceName: 'get-rays-function' })

export const queryParamsSchema = z.object({
  page: numberSchema.optional().default(1),
  limit: numberSchema.optional().default(10),
  userAddress: z.string().optional().default(''),
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

  const { page, limit, userAddress } = parsedResult.data
  const offset = (page - 1) * limit

  const dbConfig = {
    connectionString: RAYS_DB_CONNECTION_STRING,
    logger,
  }

  const { db } = await getRaysDB(dbConfig)

  const leaderboard = await db
    .selectFrom('leaderboard')
    .selectAll()
    .where((eb) => eb.or([
      eb('userAddress', 'like', `%${userAddress}%`),
      eb('ens', 'like', `%${userAddress}%`)
    ]))
    .orderBy('totalPoints', 'desc')
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
