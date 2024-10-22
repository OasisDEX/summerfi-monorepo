import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ResponseBadRequest, ResponseOkSimple } from '@summerfi/serverless-shared/responses'
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

  const userAddressId = await db
    .selectFrom('userAddress')
    .where('userAddress.address', '=', address.toLowerCase())
    .select(['userAddress.id', 'userAddress.id'])
    .limit(1)
    .execute()

  if (userAddressId.length === 0) {
    return ResponseOkSimple({
      body: {
        address,
        userMultipliers: [],
        positionMultipliers: {},
      },
    })
  }

  // get both - multipliers per userAddress and multipliers per user positions
  const positionsMultiplier = await db
    .selectFrom('multiplier')
    .leftJoin('position', 'multiplier.positionId', 'position.id')
    .leftJoin('userAddress', 'multiplier.userAddressId', 'userAddress.id')
    .where(({ or, eb }) =>
      or([
        eb('userAddress.address', '=', address.toLowerCase()),
        eb('position.userAddressId', '=', userAddressId[0].id),
      ]),
    )
    .select(['userAddress.address', 'position.externalId', 'multiplier.value', 'multiplier.type'])
    .execute()

  return ResponseOkSimple({
    body: {
      address,
      userMultipliers: positionsMultiplier.filter((item) => item.address),
      positionMultipliers: groupBy(
        positionsMultiplier.filter((item) => item.externalId),
        (element) => element.externalId || '', // fallback to empty string, but must be defined due to filtering
      ),
    },
  })
}

export default handler
