/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'

export type ContextOptions = CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>

export type Context = {
  provider: undefined | string
}

// context for each request
export const createContext = (opts: ContextOptions) => {
  return {
    provider: undefined,
  }
}
