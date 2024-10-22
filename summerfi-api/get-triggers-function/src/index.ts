import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOkSimple,
} from '@summerfi/serverless-shared/responses'
import { getAutomationSubgraphClient } from '@summerfi/automation-subgraph'
import { getSimpleTriggers } from './helpers/get-simple-triggers'
import { getAdvancedTriggers } from './helpers/get-advanced-triggers'
import { logger } from './helpers/logger'
import { mapResponse } from './helpers/map-response'
import { paramsSchema } from './constants'

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE
  const RPC_GATEWAY = process.env.RPC_GATEWAY

  logger.addContext(context)

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  if (!RPC_GATEWAY) {
    logger.error('RPC_GATEWAY is not set')
    return ResponseInternalServerError('RPC_GATEWAY is not set')
  }

  logger.info(`Query params`, { params: event.queryStringParameters })

  const queryStringParams = {
    // "dpm" is deprecated in favor of "account"
    // because the "account" field in subgraph
    // works both with DS and DPM proxy addresses
    // *TLDR*: use "account" for the position address
    account: event.queryStringParameters?.account || event.queryStringParameters?.dpm, // leaving this for backward compatibility
    ...event.queryStringParameters,
  }

  const parseResult = paramsSchema.safeParse(queryStringParams)
  if (!parseResult.success) {
    logger.warn('Incorrect query params', {
      params: queryStringParams,
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

  const automationSubgraphClient = getAutomationSubgraphClient({
    urlBase: SUBGRAPH_BASE,
    chainId: params.chainId,
    logger,
  })

  const triggers = await automationSubgraphClient.getTriggers(params)

  logger.info(`Got ${triggers.triggers.length} triggers`, {
    triggers: triggers.triggers,
    account: params.account,
  })

  // simple triggers that can be mapped just from the list
  const simpleTriggers = await getSimpleTriggers({ triggers: triggers.triggers, params })
  // advanced triggers that need simple triggers and some additional data/mapping
  const advancedTriggers = await getAdvancedTriggers({
    simpleTriggers,
    triggers,
    params,
    envs: {
      SUBGRAPH_BASE,
      RPC_GATEWAY,
    },
  })

  const response = mapResponse({
    simpleTriggers,
    advancedTriggers,
    triggers,
    params,
  })

  return ResponseOkSimple({ body: response })
}

export default handler
