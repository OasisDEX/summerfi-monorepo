import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { GraphQLClient } from 'graphql-request'
import { getSdk } from './generated/client'

import { Logger } from '@aws-lambda-powertools/logger'
import {
  addressSchema,
  ChainId,
  isValidAddress,
  NetworkByChainID,
} from '@summerfi/serverless-shared'

const logger = new Logger({ serviceName: 'get-earn-protocol-fleets' })

const availableChains = [ChainId.ARBITRUM, ChainId.BASE]
const availableSubgraphs = availableChains.map((chain) => String(NetworkByChainID[chain]))

const pathParamsSchema = z
  .object({
    fleetId: addressSchema,
    chainId: z.string(z.nativeEnum(ChainId)),
  })
  .optional()

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

  logger.addContext(context)

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }
  logger.info(`Path params`, { params: event.pathParameters })

  const pathParamsResult = pathParamsSchema.safeParse(event.pathParameters)

  if (!pathParamsResult.success) {
    logger.warn('Incorrect path params', {
      params: event.pathParameters,
      errors: pathParamsResult.error.errors,
    })
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: pathParamsResult.error.errors,
    })
  }

  const pathParams = pathParamsResult.data

  if (
    pathParams &&
    isValidAddress(pathParams.fleetId) &&
    availableChains.map(String).includes(pathParams.chainId)
  ) {
    try {
      const { fleetId, chainId } = pathParams
      const networkName = NetworkByChainID[chainId as unknown as ChainId]
      const client = new GraphQLClient(`${SUBGRAPH_BASE}/summer-protocol-${networkName}`)
      const sdk = getSdk(client)
      const fleetDetails = await sdk.GetFleetDetails({ id: fleetId.toLowerCase() })
      return ResponseOk({
        body: { fleetDetails: fleetDetails.vault, fleetId, chainId },
      })
    } catch (error) {
      console.error(error)
      return ResponseInternalServerError()
    }
  }

  try {
    const allNetworksFleets = await Promise.all(
      availableSubgraphs.map(async (subgraph) => {
        const client = new GraphQLClient(`${SUBGRAPH_BASE}/summer-protocol-${subgraph}`)
        const sdk = getSdk(client)
        return sdk.GetFleets()
      }),
    )
    const fleets = allNetworksFleets.reduce(
      (acc, { vaults }) => {
        return acc.concat(vaults)
      },
      [] as (typeof allNetworksFleets)[number]['vaults'],
    )
    return ResponseOk({
      body: { fleets },
    })
  } catch (error) {
    console.error(error)
    return ResponseInternalServerError()
  }
}

export default handler
