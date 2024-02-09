import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { appRouter } from './server'
import { createContext } from './createContext'

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
// test mono imports
import { ResponseOk } from '@summerfi/serverless-shared/responses'
// test ts paths imports

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const handler = async (_event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
//   return ResponseOk({ body: { message: 'Hello from summerfi-api' } })
// }

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: createContext,
})
