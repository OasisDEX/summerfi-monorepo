import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { sdkAppRouter, createSDKContext } from '@summerfi/sdk-server'
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger'
import middy from '@middy/core'
const logger = new Logger({
  serviceName: 'sdk-router-function',
  logLevel: 'DEBUG',
})

export const baseHandler = awsLambdaRequestHandler({
  router: sdkAppRouter,
  createContext: createSDKContext,
})

export const handler = middy(baseHandler).use(injectLambdaContext(logger))
