import type { APIGatewayProxyResultV2 } from 'aws-lambda'
import type { DefaultErrorResponse, DefaultSuccessResponse } from './helper-types'
import { serialize } from './serialize'

export function createOkBody(obj: Record<string, unknown>): string | undefined {
  return serialize(obj)
}

export function createErrorBody(message: string): string | undefined {
  const errorObject: DefaultErrorResponse = { message }
  return serialize(errorObject)
}

export function createHeaders(): Record<string, string | number | boolean> {
  return {
    'Access-Control-Allow-Origin': '*',
    'content-type': 'application/json',
  }
}

/**
 * Standardized 200 response with data, code and message fields providing extra context for handling on the client
 * @param body
 * @returns APIGatewayProxyResultV2
 */
export function ResponseOk<T extends DefaultSuccessResponse<unknown>>(
  body: T,
): APIGatewayProxyResultV2 {
  return {
    statusCode: 200,
    headers: createHeaders(),
    body: createOkBody(body),
  }
}

/**
 * Simple ok response with just data, good for POCs, don't use in production
 * @deprecated better to use ResponseOk with standardized response format
 * @param body
 * @returns APIGatewayProxyResultV2
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ResponseOkSimple<T extends Record<string, any>>({
  body,
}: {
  body: T
}): APIGatewayProxyResultV2 {
  return {
    statusCode: 200,
    headers: createHeaders(),
    body: createOkBody(body),
  }
}

export function ResponseBadRequest(message: string | object): APIGatewayProxyResultV2 {
  return {
    statusCode: 400,
    headers: createHeaders(),
    body: typeof message === 'object' ? serialize(message) : createErrorBody(message),
  }
}

export function ResponseNotFound(): APIGatewayProxyResultV2 {
  return {
    statusCode: 404,
    headers: createHeaders(),
  }
}

export function ResponseInternalServerError(
  message: string = 'Internal server error',
): APIGatewayProxyResultV2 {
  return {
    statusCode: 500,
    headers: createHeaders(),
    body: createErrorBody(message),
  }
}

export function ResponseForbidden(message: string = 'Forbidden'): APIGatewayProxyResultV2 {
  return {
    statusCode: 403,
    headers: createHeaders(),
    body: createErrorBody(message),
  }
}
