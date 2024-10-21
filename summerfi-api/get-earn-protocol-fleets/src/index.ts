import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ResponseInternalServerError, ResponseOk } from '@summerfi/serverless-shared/responses'
import { GraphQLClient } from 'graphql-request'
import { getSdk } from './generated/client'

import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'get-earn-protocol-fleets' })

const availableSubgraphs = ['summer-protocol-arbitrum']

export const handler = async (
  _event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

  logger.addContext(context)

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  try {
    const allNetworksFleets = await Promise.all(
      availableSubgraphs.map(async (subgraph) => {
        const url = `${SUBGRAPH_BASE}/${subgraph}`
        const client = new GraphQLClient(url)
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
