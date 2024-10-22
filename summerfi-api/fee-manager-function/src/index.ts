import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

import { getDefaultErrorMessage } from '@summerfi/serverless-shared/helpers'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseNotFound,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'

import {
  ChainId,
  chainIdSchema,
  protocolIdSchema,
  type ProtocolId,
} from '@summerfi/serverless-shared'
import { createGraphQLClient } from './createGraphQLClient'
import { calculateFee } from './calculateFee'

const paramsSchema = z.object({
  chainId: chainIdSchema,
  protocolId: protocolIdSchema,
  positionId: z.string(),
})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  //set envs
  const { SUBGRAPH_BASE: subgraphBase = process.env.SUBGRAPH_BASE } =
    (event.stageVariables as Record<string, string>) || {}

  if (!subgraphBase) {
    throw new Error('Missing env vars in the running env')
  }

  // params
  let chainId: ChainId
  let protocolId: ProtocolId
  let positionId: string

  // validate request params
  try {
    const parsedParams = paramsSchema.parse(event.queryStringParameters)
    chainId = parsedParams.chainId
    protocolId = parsedParams.protocolId
    positionId = parsedParams.positionId
  } catch (error) {
    console.log(error)
    const message = getDefaultErrorMessage(error)
    return ResponseBadRequest(message)
  }

  // handler logic
  try {
    const subgraphClient = createGraphQLClient(chainId, protocolId, subgraphBase)

    const position = await subgraphClient.GetPosition(positionId)

    if (!position) {
      return ResponseNotFound(`Position with id (${positionId}) not found`)
    }

    const fee = calculateFee(position)

    return ResponseOk({
      message: 'Success',
      data: {
        fee,
      },
    })
  } catch (error) {
    console.error(error)
    return ResponseInternalServerError()
  }
}

export default handler
