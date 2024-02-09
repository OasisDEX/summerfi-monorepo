import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
// test mono imports
import { ResponseOk } from '@summerfi/serverless-shared/responses'
// test ts paths imports
import { body } from '~src/body'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = async (_event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  return ResponseOk(body)
}
