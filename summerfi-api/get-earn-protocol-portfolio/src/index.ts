import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { makeSDK } from '@summerfi/sdk-client'

import { Logger } from '@aws-lambda-powertools/logger'
import { addressSchema } from '@summerfi/serverless-shared'
import { Address, AddressValue, ChainFamilyMap } from '@summerfi/sdk-common'

const logger = new Logger({ serviceName: 'get-earn-protocol-portfolio' })

const pathParamsSchema = z.object({
  address: addressSchema,
})

const supportedNetworks = [ChainFamilyMap.Arbitrum.ArbitrumOne]

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  logger.addContext(context)
  const SDK_API_URL = process.env.SDK_API_URL

  if (!SDK_API_URL) {
    logger.error('SDK_API_URL is not set')
    return ResponseInternalServerError('SDK_API_URL is not set')
  }

  logger.info(`Query params`, { params: event.pathParameters })

  const pathParamsResult = pathParamsSchema.safeParse(event.pathParameters)
  if (!pathParamsResult.success) {
    logger.warn('Incorrect query params', {
      params: event.queryStringParameters,
      errors: pathParamsResult.error.errors,
    })
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: pathParamsResult.error.errors,
    })
  }

  const { address } = pathParamsResult.data
  const sdk = makeSDK({ apiURL: SDK_API_URL })

  try {
    const networkPositionsArray = await Promise.all(
      supportedNetworks.map(async (network) => {
        const walletAddress = Address.createFromEthereum({
          value: address as AddressValue,
        })
        const { user } = await sdk.users.getUserClient({ chainInfo: network, walletAddress })
        const positions = await sdk.armada.users.getUserPositions({ user })
        return positions
      }),
    )
    const positions = networkPositionsArray.reduce((acc, pos) => {
      return acc.concat(pos)
    }, [])
    return ResponseOk({
      body: { positions },
    })
  } catch (error) {
    console.error(error)
    return ResponseInternalServerError()
  }
}

export default handler
