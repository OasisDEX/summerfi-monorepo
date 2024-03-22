import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import {
  addressSchema,
  chainIdSchema,
  urlOptionalSchema,
} from '@summerfi/serverless-shared/validators'

import { Logger } from '@aws-lambda-powertools/logger'
import { ChainId } from '@summerfi/serverless-shared'
import { getClaims } from './get-claims'

const logger = new Logger({ serviceName: 'get-morpho-claims-function' })

const paramsSchema = z.object({
  account: addressSchema,
  chainId: chainIdSchema.optional().default(ChainId.MAINNET),
  rpc: urlOptionalSchema,
})

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const RPC_GATEWAY = process.env.RPC_GATEWAY

  logger.addContext(context)
  if (!RPC_GATEWAY) {
    logger.error('RPC_GATEWAY is not set')
    return ResponseInternalServerError('RPC_GATEWAY is not set')
  }

  logger.info(`Query params`, { params: event.queryStringParameters })

  const parseResult = paramsSchema.safeParse(event.queryStringParameters)
  if (!parseResult.success) {
    logger.warn('Incorrect query params', {
      params: event.queryStringParameters,
      errors: parseResult.error.errors,
    })
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: parseResult.error.errors,
    })
  }
  const params = parseResult.data

  logger.appendKeys({
    chainId: params.chainId,
  })

  const claims = await getClaims({
    account: params.account,
    customRpc: params.rpc,
    rpcGateway: RPC_GATEWAY,
    chainId: ChainId.MAINNET,
  })

  return ResponseOk({ body: claims })
}

export default handler
