import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { sdkAppRouter, createSDKContext } from '@summerfi/sdk-server'

export const baseHandler = awsLambdaRequestHandler({
  router: sdkAppRouter,
  createContext: createSDKContext,
  maxBatchSize: 5,
})

export const handler = baseHandler
