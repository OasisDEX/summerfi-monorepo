import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ResponseBadRequest, ResponseOk } from '@summerfi/serverless-shared/responses'
import { Logger } from '@aws-lambda-powertools/logger'
import { getRaysDB } from '@summerfi/rays-db'
import { addressSchema } from '@summerfi/serverless-shared'
import { z } from 'zod'

const logger = new Logger({ serviceName: 'get-rays-function' })

export const queryParamsSchema = z.object({
  address: addressSchema,
})

const groupBy = <T>(
  array: Array<T>,
  propertyKey: (element: T, index: number) => string | number,
): Record<string | number, T[]> => {
  return array.reduce(
    (acc, element, currentIndex) => {
      const key = propertyKey(element, currentIndex)

      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(element)
      return acc
    },
    {} as Record<string | number, T[]>,
  )
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const { RAYS_DB_CONNECTION_STRING } = process.env
  if (!RAYS_DB_CONNECTION_STRING) {
    throw new Error('RAYS_DB_CONNECTION_STRING is not set')
  }

  logger.addContext(context)

  const parsedResult = queryParamsSchema.safeParse(event.queryStringParameters)
  if (!parsedResult.success) {
    return ResponseBadRequest({ body: { message: parsedResult.error.message } })
  }

  const { address } = parsedResult.data

  const dbConfig = {
    connectionString: RAYS_DB_CONNECTION_STRING,
    logger,
  }

  const { db } = await getRaysDB(dbConfig)

  const userPoints = await db
    .selectFrom('pointsDistribution')
    .innerJoin('userAddress', 'pointsDistribution.userAddressId', 'userAddress.id')
    .leftJoin(
      'eligibilityCondition',
      'pointsDistribution.eligibilityConditionId',
      'eligibilityCondition.id',
    )
    .where('userAddress.address', '=', address.toLowerCase())
    .select([
      'userAddress.address',
      'pointsDistribution.points',
      'eligibilityCondition.dueDate',
      'eligibilityCondition.type',
      'pointsDistribution.description',
    ])
    .execute()

  const positionsPoints = await db
    .selectFrom('pointsDistribution')
    .innerJoin('position', 'pointsDistribution.positionId', 'position.id')
    .innerJoin('userAddress', 'position.userAddressId', 'userAddress.id')
    .leftJoin(
      'eligibilityCondition',
      'pointsDistribution.eligibilityConditionId',
      'eligibilityCondition.id',
    )
    .where('userAddress.address', '=', address.toLowerCase())
    .select([
      'userAddress.address',
      'pointsDistribution.points',
      'eligibilityCondition.dueDate',
      'eligibilityCondition.type',
      'pointsDistribution.description',
    ])
    .execute()
  const positionInLeaderboard = await db
    .selectFrom('leaderboard')
    .where('userAddress', '=', address.toLowerCase())
    .select(['position'])
    .execute()
  const points = userPoints.concat(positionsPoints)

  const byDueDate = groupBy(
    points,
    (result) => `${result.dueDate?.getTime() ?? 0}-${result.type ?? ''}`,
  )

  const result = Object.entries(byDueDate).map(([dueDate, points]) => {
    const total = points.reduce((acc, result) => acc + Number(result.points), 0)
    const [timestamp, type] = dueDate.split('-')
    return {
      dueDate: Number(timestamp) === 0 ? null : new Date(Number(timestamp)),
      points: total,
      type: type ?? '',
    }
  })

  const eligiblePoints = result.find((result) => result.dueDate === null)?.points ?? 0
  const allPossiblePoints = result.reduce((acc, result) => acc + Number(result.points), 0)
  const actionRequiredPoints = result.filter((result) => result.dueDate !== null)
  const userTypes = userPoints.map((item) => item.description)

  return ResponseOk({
    body: {
      address,
      eligiblePoints,
      allPossiblePoints,
      actionRequiredPoints,
      positionInLeaderboard: positionInLeaderboard[0]?.position,
      userTypes,
    },
  })
}

export default handler
