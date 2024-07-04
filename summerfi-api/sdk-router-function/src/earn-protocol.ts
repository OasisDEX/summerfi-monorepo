import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { earnProtocolAppRouter, createEarnProtocolContext } from '@summerfi/sdk-server'

export const handler = awsLambdaRequestHandler({
  router: earnProtocolAppRouter,
  createContext: createEarnProtocolContext,
})
