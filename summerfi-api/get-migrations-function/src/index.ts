import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { getDefaultErrorMessage } from '@summerfi/serverless-shared/helpers'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOkSimple,
} from '@summerfi/serverless-shared/responses'
import { addressSchema } from '@summerfi/serverless-shared/validators'
import {
  PortfolioMigration,
  PortfolioMigrationsResponse,
} from '@summerfi/serverless-shared/domain-types'
import { createMigrationsClient } from './client'
import { parseEligibleMigration } from './parseEligibleMigration'
import { MigrationConfig } from 'migrations-config'
import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'get-migrations-function' })

const paramsSchema = z
  .object({
    address: addressSchema,
    customRpcUrl: z.string().optional(),
    chainId: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined) {
          return undefined
        }
        return parseInt(val, 10)
      }),
  })
  .refine(
    (params) => {
      if (params.customRpcUrl) {
        return params.chainId !== undefined && params.chainId !== -1
      }
      if (params.chainId !== undefined && params.chainId !== -1) {
        return params.customRpcUrl !== undefined
      }
      return true
    },
    {
      message: 'customRpcUrl and chainId must be provided together',
    },
  )

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  //set envs
  const { RPC_GATEWAY } = (event.stageVariables as Record<string, string>) || {
    RPC_GATEWAY: process.env.RPC_GATEWAY,
  }

  logger.addContext(context)

  const params = paramsSchema.safeParse(event.queryStringParameters)
  if (!params.success) {
    console.log(params.error)
    const message = getDefaultErrorMessage(params.error)
    return ResponseBadRequest(message)
  }
  const address = params.data.address
  const customRpcUrl = params.data.customRpcUrl
  const chainId = params.data.chainId

  logger.appendKeys({
    address: address,
  })

  try {
    if (!RPC_GATEWAY) {
      throw new Error('RPC_GATEWAY env variable is not set')
    }

    const migrationsClient = createMigrationsClient(
      MigrationConfig,
      RPC_GATEWAY,
      customRpcUrl,
      chainId,
      logger,
    )

    const eligibleMigrations: PortfolioMigration[] = []

    const protocolAssetsToMigrate = await migrationsClient.getProtocolAssetsToMigrate(address)

    protocolAssetsToMigrate.forEach((protocolAssets) => {
      const eligibleMigration = parseEligibleMigration(protocolAssets)
      if (eligibleMigration) {
        eligibleMigrations.push(eligibleMigration)
      }
    })

    const legacyMigration = eligibleMigrations.filter(
      (migration) => migration.positionAddressType === 'EOA',
    )

    return ResponseOkSimple<PortfolioMigrationsResponse>({
      body: { migrations: legacyMigration, migrationsV2: eligibleMigrations },
    })
  } catch (error) {
    console.error(error)
    return ResponseInternalServerError()
  }
}

export default handler
