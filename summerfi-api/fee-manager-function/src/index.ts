import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'

import { getDefaultErrorMessage } from '@summerfi/serverless-shared/helpers'
import { ResponseBadRequest, ResponseOk } from '@summerfi/serverless-shared/responses'

import { ChainId, chainIdSchema } from '@summerfi/serverless-shared'
import { createGraphQLClient } from './createGraphQLClient'
import { calculateFee } from './calculateFee'

const paramsSchema = z.object({
  chainId: chainIdSchema,
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
  let positionId: string

  // validate inputs
  try {
    const parsedParams = paramsSchema.parse(event.queryStringParameters)
    chainId = parsedParams.chainId
    positionId = parsedParams.positionId
  } catch (error) {
    console.log(error)
    const message = getDefaultErrorMessage(error)
    return ResponseBadRequest(message)
  }

  const subgraphClient = createGraphQLClient(chainId, subgraphBase)

  const position = await subgraphClient
    .GetPosition({
      id: positionId,
    })
    .then((result) => {
      return result.position
    })
    .catch((error) => {
      console.error(error)
      throw new Error('Failed to fetch from subgraph')
    })

  if (!position) {
    return ResponseBadRequest(`Position with id (${positionId}) not found`)
  }

  try {
    const fee = calculateFee(position)

    return ResponseOk({
      message: 'Success',
      data: {
        fee,
      },
    })
  } catch (error) {
    console.error(error)
    return ResponseBadRequest(error ?? 'Unhandled server error')
  }
}

export default handler
