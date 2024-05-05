import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ResponseNotFound, ResponseOk } from '@summerfi/serverless-shared/responses'
import { Logger } from '@aws-lambda-powertools/logger'
import { getRaysDB } from '@summerfi/rays-db'
import { RDS } from 'sst/node/rds'
import { RDSData } from '@aws-sdk/client-rds-data'

const logger = new Logger({ serviceName: 'get-rays-function' })

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  logger.addContext(context)

  if (!event.queryStringParameters) {
    return ResponseNotFound()
  }

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

  const { address } =
    'address' in event.queryStringParameters ? event.queryStringParameters : { address: '' }

  const result = await db
    .selectFrom('pointsDistribution')
    .innerJoin('position', 'pointsDistribution.positionId', 'position.id')
    .innerJoin('userAddress', 'position.userAddressId', 'userAddress.id')
    .where('userAddress.address', '=', address ?? '')
    .select(['userAddress.address', 'pointsDistribution.points'])
    .executeTakeFirst()

  return ResponseOk({ body: { message: 'Hello World!', result: result } })
}

export default handler
