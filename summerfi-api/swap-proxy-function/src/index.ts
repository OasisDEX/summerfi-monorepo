import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  createHeaders,
  ResponseForbidden,
  ResponseInternalServerError,
} from '@summerfi/serverless-shared'
import { z } from 'zod'

import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'swap-proxy-function' })

const pathParams = z.object({
  proxy: z.string(),
})

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const ONE_INCH_API_URL = process.env.ONE_INCH_API_URL

  logger.addContext(context)
  if (!ONE_INCH_API_URL) {
    logger.error('ONE_INCH_API_URL is not set')
    return ResponseInternalServerError('ONE_INCH_API_URL is not set')
  }

  const apiKey = event.headers['auth-key']

  if (!apiKey) {
    logger.warn('auth-key is not set')
    return ResponseForbidden('auth-key is not set')
  }

  const { proxy } = pathParams.parse(event.pathParameters)

  const query = new URLSearchParams()
  Object.entries(event.queryStringParameters ?? {}).forEach(([key, value]) => {
    if (value && key !== 'protocols') {
      query.set(key, value)
    }
  })

  const url = `${ONE_INCH_API_URL}/${proxy}${query.toString() ? `?${query.toString()}` : ''}`
  const headers = { ['auth-key']: apiKey }
  const response = await fetch(url, { headers })

  return {
    headers: createHeaders(),
    statusCode: response.status,
    body: await response.text(),
  }
}

export default handler
