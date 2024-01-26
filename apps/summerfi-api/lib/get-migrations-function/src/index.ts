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
  Address,
  PortfolioMigration,
  PortfolioMigrationsResponse,
} from '@summerfi/serverless-shared/domain-types'
import { createMigrationsClient } from './client'
import { parseEligibleMigration } from './parseEligibleMigration'
import { MigrationConfig } from 'migrations-config'

const paramsSchema = z.object({
  address: addressSchema,
  customRpcUrl: z.string().optional(),
})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  //set envs
  const { RPC_GATEWAY } = (event.stageVariables as Record<string, string>) || {
    RPC_GATEWAY: process.env.RPC_GATEWAY,
  }

  // params
  let address: Address | undefined
  let customRpcUrl: string | undefined

  // validation
  try {
    const params = paramsSchema.parse(event.queryStringParameters)
    address = params.address
    customRpcUrl = params.customRpcUrl
  } catch (error) {
    console.log(error)
    const message = getDefaultErrorMessage(error)
    return ResponseBadRequest(message)
  }

  try {
    if (!RPC_GATEWAY) {
      throw new Error('RPC_GATEWAY env variable is not set')
    }

    const migrationsClient = createMigrationsClient(RPC_GATEWAY, customRpcUrl, MigrationConfig)

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
