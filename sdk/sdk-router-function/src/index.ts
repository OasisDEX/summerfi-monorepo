import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { sdkAppRouter, createSDKContext } from '@summerfi/sdk-server'

export const handler = awsLambdaRequestHandler({
  router: sdkAppRouter,
  createContext: createSDKContext,
})
