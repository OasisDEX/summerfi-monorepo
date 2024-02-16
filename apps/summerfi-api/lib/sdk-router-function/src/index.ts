import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import { appRouter } from './app-router'
import { createContext } from './context'

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: createContext,
})
