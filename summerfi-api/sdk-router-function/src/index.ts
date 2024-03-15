import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { SDKAppRouter, createSDKContext } from '@summerfi/sdk-server'

export const handler = awsLambdaRequestHandler({
  router: SDKAppRouter,
  createContext: createSDKContext,
})
