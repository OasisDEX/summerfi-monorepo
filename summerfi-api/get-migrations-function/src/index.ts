import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { getDefaultErrorMessage } from '@summerfi/serverless-shared/helpers'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { addressSchema } from '@summerfi/serverless-shared/validators'
import {
  PortfolioMigration,
  PortfolioMigrationsResponse,
} from '@summerfi/serverless-shared/domain-types'
import { createMigrationsClient } from './client'
import { parseEligibleMigration } from './parseEligibleMigration'
import { MigrationConfig } from 'migrations-config'

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

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  //set envs
  const { RPC_GATEWAY } = (event.stageVariables as Record<string, string>) || {
    RPC_GATEWAY: process.env.RPC_GATEWAY,
  }

  const params = paramsSchema.safeParse(event.queryStringParameters)
  if (!params.success) {
    console.log(params.error)
    const message = getDefaultErrorMessage(params.error)
    return ResponseBadRequest(message)
  }
  const address = params.data.address
  const customRpcUrl = params.data.customRpcUrl
  const chainId = params.data.chainId

  try {
    if (!RPC_GATEWAY) {
      throw new Error('RPC_GATEWAY env variable is not set')
    }

    const migrationsClient = createMigrationsClient(
      MigrationConfig,
      RPC_GATEWAY,
      customRpcUrl,
      chainId,
    )

    const eligibleMigrations: PortfolioMigration[] = []
    const protocolAssetsToMigrate = await migrationsClient.getProtocolAssetsToMigrate(address)

    protocolAssetsToMigrate.forEach((protocolAssets) => {
      const eligibleMigration = parseEligibleMigration(protocolAssets)
      if (eligibleMigration) {
        eligibleMigrations.push(eligibleMigration)
      }
    })

    return ResponseOk<PortfolioMigrationsResponse>({ body: { migrations: eligibleMigrations } })
  } catch (error) {
    console.error(error)
    return ResponseInternalServerError()
  }
}

export default handler
