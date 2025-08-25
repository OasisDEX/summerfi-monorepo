// Simple Lambda handler for OPTIONS requests (CORS preflight)
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

export const handler: APIGatewayProxyHandlerV2 = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key',
      'Access-Control-Allow-Credentials': 'false',
      'Access-Control-Expose-Headers': 'x-amz-request-id',
      'Access-Control-Max-Age': '86400',
    },
    body: '',
  }
}
