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
      'position.details',
      'position.externalId',
    ])
    .execute()

  return ResponseOk({
    body: {
      address,
      positionsPoints: groupBy(positionsPoints, (element) => element.externalId),
    },
  })
}

export default handler
