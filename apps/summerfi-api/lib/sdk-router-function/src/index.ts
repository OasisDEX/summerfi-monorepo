import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { appRouter } from './server'
import { createContext } from './createContext'

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: createContext,
})
