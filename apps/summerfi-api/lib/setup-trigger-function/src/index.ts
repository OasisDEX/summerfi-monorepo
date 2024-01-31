import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
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
import { ProtocolId } from '@summerfi/serverless-shared/domain-types'

const logger = new Logger({ serviceName: 'setupTriggerFunction' })

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const RPC_GATEWAY = process.env.RPC_GATEWAY
  const GET_TRIGGERS_URL = process.env.GET_TRIGGERS_URL
  const SKIP_VALIDATION = process.env.SKIP_VALIDATION

  const skipValidation = SKIP_VALIDATION === 'true'

  if (!RPC_GATEWAY) {
    logger.error('RPC_GATEWAY is not set')
    return ResponseInternalServerError('RPC_GATEWAY is not set')
  }

  if (!GET_TRIGGERS_URL) {
    logger.error('GET_TRIGGERS_URL is not set')
    return ResponseInternalServerError('GET_TRIGGERS_URL is not set')
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

  if (pathParamsResult.data.protocol !== ProtocolId.AAVE3) {
    const errors: ValidationIssue[] = [
      {
        code: 'not-supported-protocol',
        message: 'Only AAVE3 protocol is supported',
        path: ['protocol'],
      },
    ]
    return ResponseBadRequest({
      message: 'Not Supported yet',
      errors,
    })
  }

  const body = JSON.parse(event.body ?? '{}')

  logger.info('Got body', { body })

  const bodySchema = getBodySchema(pathParamsResult.data.trigger)

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

  const params = parseResult.data

  const {
    getPosition,
    getExecutionPrice,
    simulatePosition,
    getTriggerTxData,
    encodeForDPM,
    validate,
  } = buildServiceContainer(
    pathParamsResult.data.chainId,
    pathParamsResult.data.protocol,
    pathParamsResult.data.trigger,
    bodySchema,
    RPC_GATEWAY,
    GET_TRIGGERS_URL,
    params.rpc,
    logger,
  )

  const position = await getPosition({
    dpm: params.dpm,
    collateral: params.position.collateral,
    debt: params.position.debt,
  })

  const executionPrice = getExecutionPrice({
    ...position,
    ltv: params.triggerData.executionLTV,
  })

  let validationWarnings: ValidationIssue[] = []

  if (!skipValidation) {
    const validation = await validate({
      position,
      executionPrice,
      triggerData: params.triggerData,
      action: params.action,
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

  const { txData, encodedTriggerData } = await getTriggerTxData({
    position,
    triggerData: params.triggerData,
    action: params.action,
  })

  logger.debug('Encoded trigger', { txData, encodedTriggerData, action: params.action })

  const simulation = simulatePosition({
    position: position,
    executionLTV: params.triggerData.executionLTV,
    executionPrice: executionPrice,
    targetLTV: params.triggerData.targetLTV,
  })

  const transaction = encodeForDPM({
    dpm: params.dpm,
    triggerTxData: txData,
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
