import type { APIGatewayProxyEventV2, Context, APIGatewayProxyResultV2 } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import {
  getBodySchema,
  mapZodResultToValidationResults,
  pathParamsSchema,
  ValidationIssue,
} from '~types'
import { Logger } from '@aws-lambda-powertools/logger'
import { buildServiceContainer } from './services'

const logger = new Logger({ serviceName: 'setupTriggerFunction' })

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const RPC_GATEWAY = process.env.RPC_GATEWAY
  const GET_TRIGGERS_URL = process.env.GET_TRIGGERS_URL
  const SKIP_VALIDATION = process.env.SKIP_VALIDATION
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

  logger.addContext(context)
  const skipValidation = SKIP_VALIDATION === 'true'
  if (!RPC_GATEWAY) {
    logger.error('RPC_GATEWAY is not set')
    return ResponseInternalServerError('RPC_GATEWAY is not set')
  }

  if (!GET_TRIGGERS_URL) {
    logger.error('GET_TRIGGERS_URL is not set')
    return ResponseInternalServerError('GET_TRIGGERS_URL is not set')
  }

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  const pathParamsResult = pathParamsSchema.safeParse(event.pathParameters || {})

  if (!pathParamsResult.success) {
    const validationResults = mapZodResultToValidationResults({
      errors: pathParamsResult.error.errors,
    })
    logger.warn('Incorrect path params', {
      params: event.pathParameters,
      errors: validationResults.errors,
    })
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: validationResults.errors,
    })
  }

  logger.appendKeys({
    chainId: pathParamsResult.data.chainId,
    protocol: pathParamsResult.data.protocol,
    trigger: pathParamsResult.data.trigger,
  })

  const body = JSON.parse(event.body ?? '{}')

  const bodySchema = getBodySchema(pathParamsResult.data)

  if (!bodySchema) {
    logger.warn('Unsupported trigger', {
      trigger: pathParamsResult.data.trigger,
      protocol: pathParamsResult.data.protocol,
      chainId: pathParamsResult.data.chainId,
    })
    return ResponseBadRequest({
      message: `Unsupported trigger: ${pathParamsResult.data.trigger} on protocol: ${pathParamsResult.data.protocol} and chain: ${pathParamsResult.data.chainId}`,
    })
  }

  const parseResult = bodySchema.safeParse(body)
  if (!parseResult.success) {
    const validationResults = mapZodResultToValidationResults({ errors: parseResult.error.errors })
    logger.warn('Incorrect data', {
      params: body,
      errors: validationResults.errors,
      warnings: validationResults.warnings,
    })
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: validationResults.errors,
      warnings: validationResults.warnings,
    })
  }

  const triggerBody = parseResult.data

  const { simulatePosition, getTransaction, validate } = buildServiceContainer(
    pathParamsResult.data.chainId,
    pathParamsResult.data.protocol,
    triggerBody,
    RPC_GATEWAY,
    SUBGRAPH_BASE,
    GET_TRIGGERS_URL,
    logger,
  )

  let validationWarnings: ValidationIssue[] = []

  if (!skipValidation) {
    const validation = await validate({
      trigger: triggerBody,
    })

    validationWarnings = validation.warnings

    if (!validation.success) {
      logger.warn('Validation Errors', {
        errors: validation.errors,
        warnings: validation.warnings,
      })
      return ResponseBadRequest({
        message: 'Validation Errors',
        errors: validation.errors,
        warnings: validation.warnings,
      })
    }
  } else {
    logger.warn('Skipping validation')
  }

  const { transaction, encodedTriggerData } = await getTransaction({
    trigger: triggerBody,
  })

  const simulation = await simulatePosition({
    trigger: triggerBody,
  })

  return ResponseOk({
    body: {
      simulation,
      transaction,
      encodedTriggerData,
      warnings: validationWarnings,
    },
  })
}

export default handler
