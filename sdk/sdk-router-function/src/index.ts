import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { sdkAppRouter, createSDKContext } from '@summerfi/sdk-server'

export const baseHandler = awsLambdaRequestHandler({
  router: sdkAppRouter,
  createContext: createSDKContext,
  allowMethodOverride: true,
})

export const handler = baseHandler
