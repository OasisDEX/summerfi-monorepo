import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ResponseBadRequest, ResponseOk } from '@summerfi/serverless-shared/responses'
import { Logger } from '@aws-lambda-powertools/logger'
import { getRaysDB } from '@summerfi/rays-db'
import { RDS } from 'sst/node/rds'
import { RDSData } from '@aws-sdk/client-rds-data'
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
  logger.addContext(context)

  const parsedResult = queryParamsSchema.safeParse(event.queryStringParameters)
  if (!parsedResult.success) {
    return ResponseBadRequest({ body: { message: parsedResult.error.message } })
  }

  const { address } = parsedResult.data

  const dbConfig =
    process.env.IS_LOCAL === 'true'
      ? {
          connectionString: process.env.RAYS_DB_CONNECTION_STRING ?? '',
        }
      : {
          database: RDS['rays-database'].defaultDatabaseName,
          secretArn: RDS['rays-database'].secretArn,
          resourceArn: RDS['rays-database'].clusterArn,
          client: new RDSData({}),
        }

  const db = await getRaysDB(dbConfig)

  const query = db
    .selectFrom('pointsDistribution')
    .leftJoin(
      'eligibilityCondition',
      'pointsDistribution.eligibilityConditionId',
      'eligibilityCondition.id',
    )
    .innerJoin('position', 'pointsDistribution.positionId', 'position.id')
    .leftJoin('positionMultiplier', 'position.id', 'positionMultiplier.positionId')
    .leftJoin('multiplier as p_multiplier', 'positionMultiplier.multiplierId', 'p_multiplier.id')
    .innerJoin('userAddress', 'position.userAddressId', 'userAddress.id')
    .leftJoin('userAddressMultiplier', 'userAddress.id', 'userAddressMultiplier.userAddressId')
    .leftJoin(
      'multiplier as user_multiplier',
      'userAddressMultiplier.multiplierId',
      'user_multiplier.id',
    )
    .where('userAddress.address', '=', address)
    .select([
      'userAddress.address',
      'position.id as position_id',
      'pointsDistribution.points',
      'eligibilityCondition.dueDate',
      'p_multiplier.value as position_multiplier',
      'user_multiplier.value as user_multiplier',
    ])

  const results = await query.execute()

  const userMultiplier =
    results.find((result) => result.user_multiplier != null)?.user_multiplier ?? 1 // the value will be the same for all results

  const byDueDate = groupBy(results, (result) => result.dueDate?.getTime() ?? 0)

  const result = Object.entries(byDueDate).map(([dueDate, points]) => {
    const notNullPoints = points ?? []
    const perPosition = groupBy(notNullPoints, (result) => result.position_id)
    const perPositionTotal = Object.entries(perPosition).map(([positionId, positionPoints]) => {
      const notNullPositionPoints = positionPoints ?? []
      const allPositionPoints = notNullPositionPoints.reduce(
        (acc, result) => acc + result.points,
        0,
      )
      const multiplier =
        notNullPositionPoints.find((result) => result.position_multiplier != null)
          ?.position_multiplier ?? 1 // the value will be the same for all results
      return {
        positionId,
        positionPoints: allPositionPoints,
        multiplier,
        total: allPositionPoints * multiplier,
      }
    })

    const totalPoints = perPositionTotal.reduce((acc, result) => acc + result.total, 0)
    return {
      dueDate: Number(dueDate),
      totalPoints,
      breakdowns: perPositionTotal,
    }
  })

  const eligiblePoints = result.find((result) => result.dueDate === 0)?.totalPoints ?? 0
  const multipliedPoints = eligiblePoints * userMultiplier
  const allPossiblePoints =
    result.reduce((acc, result) => acc + result.totalPoints, 0) * userMultiplier
  const actionRequiredPoints = result.filter((result) => result.dueDate !== 0)

  return ResponseOk({
    body: {
      address,
      eligiblePoints,
      multipliedPoints,
      allPossiblePoints,
      actionRequiredPoints,
    },
  })
}

export default handler
